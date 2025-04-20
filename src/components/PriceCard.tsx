import { useState } from 'react';
import classNames from 'classnames';

export interface DistributionPrice {
  method: 'you' | 'me';
  value: string;
}

export interface Packages {
  amount: number;
  price: DistributionPrice[];
  weekTurnaround: number;
}

export interface Props {
  service: {
    title: string;
    description: string;
    exampleId: string;
    type: string;
    packages: Packages[];
  };
}

const selectClassNamesOptions = {
  control: (state: any) => {
    return classNames(
      'px-2xs border text-step-00 w-fit mx-auto',
      state.isFocused ? 'border-gray-1200' : 'border-gray-600',
    );
  },
  valueContainer: () => 'pr-2xs',
  indicatorSeparator: (state: any) =>
    classNames('bg-gray-600 mr-2xs', state.isFocused ? 'bg-gray-1200' : ''),
  menu: () => 'mt-3xs border border-gray-1200 bg-[white] text-step-00',
  option: (state: any) => {
    return classNames(
      'p-2xs',
      state.isFocused ? 'bg-gray-100' : '',
      state.isSelected ? 'bg-gray-400' : '',
    );
  },
};

const distributionMethods = [
  { value: 'you', label: 'For Brand Use' },
  { value: 'me', label: 'Shared by Skin Schema' },
];

const PriceCard = ({ service }: Props) => {
  const [chosenPackage] = useState(service.packages[0]);
  const [distribution, setDistribution] = useState(distributionMethods[0]);

  const handleSetDistribution = (e: any) => {
    setDistribution(e);
  };

  return (
    <li className="border border-gray-600 flex flex-col justify-between drop rounded-2xl overflow-clip">
      <div className="box flow prose">
        <h3 className="mt-zero text-step-1">{service.title}</h3>
        <p className="text-step-00">{service.description}</p>
        <p className="text-center">
          <a
            href={`#${service.exampleId}`}
            className="link flex justify-center items-center font-mono font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              className="icon mr-3xs"
            >
              <path d="M192 112H64c-8.8 0-16 7.2-16 16v64H156.1c23.5-29.3 59.5-48 99.9-48s76.5 18.7 99.9 48H464V96c0-8.8-7.2-16-16-16H271.1c-2.5 0-4.9 .6-7.2 1.7l-50.5 25.2c-6.7 3.3-14 5.1-21.5 5.1zM48 240V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V240H380c2.6 10.2 4 21 4 32c0 70.7-57.3 128-128 128s-128-57.3-128-128c0-11 1.4-21.8 4-32H48zM0 416V128C0 92.7 28.7 64 64 64l0-16c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16V64h32l50.5-25.2c8.9-4.4 18.7-6.8 28.6-6.8H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64zM336 272a80 80 0 1 0 -160 0 80 80 0 1 0 160 0z" />
            </svg>
            See examples
          </a>
        </p>
      </div>
      <div className="border-t border-t-gray-600">
        <div className="border-t border-t-gray-600">
          <div className="box w-fit mx-auto">
            <a href="/#Contact" className="button">
              Reach out
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

export default PriceCard;
