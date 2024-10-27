"use client"
import React from "react";
import { ThirdwebContract } from "thirdweb";
import { claimTo, getNFT } from "thirdweb/extensions/erc1155";
import { balanceOf } from "thirdweb/extensions/erc1155";
import { MediaRenderer, TransactionButton, useReadContract } from "thirdweb/react";
import { client } from "../client";

type NFTClaimerPROps = {
    recieverAddress?: string;
    dropContract: ThirdwebContract;
    tokenId: bigint;
};

const NFTClaimer: React.FC<NFTClaimerPROps> = ({ recieverAddress, dropContract, tokenId }) =>{
    const {data: nft,isLoading: isNFTloading} = useReadContract(
        getNFT,
        {
            contract: dropContract,
            tokenId: tokenId,
        }
    );
    const {data: ownedNFTs} = useReadContract(
        balanceOf,{
            contract: dropContract,
            owner: recieverAddress!,
            tokenId: tokenId,
            queryOptions: {enabled: !!recieverAddress }

        }
    );


    return (
        <div className="flex flex-col my-8">
            {isNFTloading ? (
                <div className="w-full mt-24">Loading...</div>
            ):(
                <>
                    {nft && (
                        <MediaRenderer
                            client={client}
                            src={nft?.metadata?.image}
                        />    
                    )}
                    {recieverAddress ? (
                        <>
                            <p className="m-8">
                            you own {ownedNFTs?.toString() || "0"} NFTs on {dropContract.chain.name}
                        </p>
                        <TransactionButton
                            transaction={()=>
                                claimTo({
                                    contract: dropContract,
                                    tokenId: tokenId,
                                    to: recieverAddress!,
                                    quantity: 1n
                                })
                            }
                            onTransactionConfirmed={async ()=>{
                                alert("NFT Claimed");
                            }}
                        >Claim</TransactionButton>
                        </>
                    ):(
                        <p className="text-center mt-8">
                            login to claim this nft
                        </p>
                    )}
                </>
            )}
        </div>
    )
};
export default NFTClaimer ;