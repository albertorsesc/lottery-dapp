import { useContract, useContractRead } from '@thirdweb-dev/react';
import Countdown from 'react-countdown';

type Props = {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
};

function CountdownTimer() {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );
  const { data: expiration } = useContractRead(contract, "expiration")
  const renderer = ({ hours, minutes, seconds, completed }: Props) => {
    if (completed) {
      return (
        <div>
          <h2 className='text-white text-xl text-center animate-bounce'>Tickets Sales have now CLOSED for this Draw.</h2>
        </div>
      );
    } else {
      return (
        <div>
          <h3 className='text-white text-sm mb-2 italic'>Time Remaming</h3>

          <div className='flex space-x-6'>

            <div className='flex-1'>
              <div className='countdown animate-pulse'>{hours}</div>
              <div className='countdown-label'>hours</div>
            </div>

            <div className='flex-1'>
              <div className='countdown animate-pulse'>{minutes}</div>
              <div className='countdown-label'>minutes</div>
            </div>

            <div className='flex-1'>
              <div className='countdown animate-pulse'>{seconds}</div>
              <div className='countdown-label'>seconds</div>
            </div>

          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <Countdown date={new Date(expiration * 1000)} renderer={renderer} />
    </div>
  )
}

export default CountdownTimer
