import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import CountdownTimer from '../components/CountdownTimer';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Login from '../components/Login';
import { currency } from '../constants';

const Home: NextPage = () => {
  const address = useAddress();
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );
  const [quantity, setQuantity] =useState<number>(1);

  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets")
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward")
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice")
  const { data: ticketCommission } = useContractRead(contract, "ticketCommission")
  const { data: expiration } = useContractRead(contract, "expiration")

  console.log(address);

  if (isLoading) return <Loading/>;

  if (!address) return <Login/>;

  return (
    <div className='bg-[#091B18] min-h-screen flex flex-col'>
      <Head>
        <title>Lottery Dapp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex-1'>
        <Header />

        <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
          <div className='stats-container'>

            <h1 className='text-5xl text-white font-semibold text-center'>
              The Next Draw
            </h1>

            <div className='flex justify-between p-2 space-x-2'>

              <div className='stats'>
                <h2 className='text-sm'>Total Pool</h2>
                <p className='text-xl'>
                  {
                    currentWinningReward &&
                    ethers.utils.formatEther(currentWinningReward.toString())
                  } {currency}
                </p>
              </div>

              <div className='stats'>
                <h2 className='text-sm'>Tickets Remaining</h2>
                <p className='text-xl'>{remainingTickets?.toNumber()}</p>
              </div>

            </div>

            {/* Countdown timer */}
            <div className='mt-5 mb-3'>
              <CountdownTimer />
            </div>

          </div>

          <div className='stats-container space-y-2'>
            <div className="stats-container">
              <div className='flex justify-between items-center text-white pb-2'>
                <h2>Price per ticket</h2>
                <p>
                  {
                    ticketPrice &&
                    ethers.utils.formatEther(ticketPrice?.toString())
                  } {currency}
                </p>
              </div>

              <div className='flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4 rounded-lg'>
                <p>TICKETS</p>
                <input type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className='flex w-full bg-transparent text-right outline-none px-2' />
              </div>

              <div className='space-y-2 mt-5'>
                <div className='flex items-center justify-between text-emerald-300 text-sm italic font-extrabold'>
                  <p>Total Cost of Tickets</p>
                  <p>
                    {
                      ticketPrice &&
                      Number(
                        ethers.utils.formatEther(ticketPrice.toString())
                      ) * quantity
                    } {currency}
                  </p>
                </div>

                <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                  <p>Service fees</p>
                  <p>
                    {
                      ticketCommission &&
                      ethers.utils.formatEther(ticketCommission?.toString())
                    } {currency}
                  </p>
                </div>

                <div className='flex items-center justify-between text-emerald-300 text-xs italic'>
                  <p>+ Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>

              <button disabled={
                expiration?.toString() < Date.now().toString() ||
                remainingTickets?.toNumber() === 0
              } className='mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-lg text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:text-gray-100'>
                Buy tickets
              </button>

            </div>
          </div>

        </div>

        {/* Price per Ticket box */}
        <div></div>
      </div>

    </div>
  )
}

export default Home;
