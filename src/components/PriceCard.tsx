import { useState } from 'react';
import Select from 'react-select';
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
    type: string;
    packages: Packages[];
  };
}

const selectClassNamesOptions = {
  control: (state: any) => {
    return classNames(
      'px-2xs border',
      state.isFocused ? 'border-gray-1200' : 'border-gray-600',
    );
  },
  valueContainer: () => 'pr-2xs',
  indicatorSeparator: (state: any) =>
    classNames('bg-gray-600 mr-2xs', state.isFocused ? 'bg-gray-1200' : ''),
  menu: () => 'mt-2xs border border-gray-1200 bg-[white]',
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
  const [chosenPackage, setChosenPackage] = useState(service.packages[0]);
  const [distribution, setDistribution] = useState(distributionMethods[0]);

  const handleAmountChange = (e: any) => {
    const selectedAmount = parseInt(e.value);
    const selectedPackage = service.packages.find(
      (option) => option.amount === selectedAmount,
    );
    if (selectedPackage) {
      setChosenPackage(selectedPackage);
    }
  };

  const handleSetDistribution = (e: any) => {
    setDistribution(e);
  };

  const selectablePackages = service.packages.map((option) => ({
    value: option.amount,
    label: option.amount,
  }));

  return (
    <li className="border border-gray-600 flex flex-col justify-between">
      <div className="box flow prose">
        <h3 className="mt-zero text-step-1">{service.title}</h3>
        <p className="text-step-00">{service.description}</p>
      </div>
      <div className="border-t border-t-gray-600">
        <div className="flex flex-col justify-center items-center p-2xs">
          <div className="flex justify-center items-center font-semibold">
            <Select
              defaultValue={distribution}
              onChange={handleSetDistribution}
              options={distributionMethods}
              className="text-step-00"
              unstyled
              classNames={selectClassNamesOptions}
            />
          </div>
          <p className="text-step-000 font-semibold mt-2xs">
            Distribution method
          </p>
        </div>
        <div className="flex divide-x divide-gray-600 border-y border-y-gray-600 text-center justify-center">
          <div className="flex flex-col grow justify-between items-center p-2xs">
            <div className="flex justify-center items-center font-semibold">
              <Select
                defaultValue={selectablePackages[0]}
                onChange={handleAmountChange}
                options={selectablePackages}
                className="text-step-00"
                unstyled
                classNames={selectClassNamesOptions}
              />
            </div>
            <p className="text-step-000 font-semibold mt-2xs">
              {service.type}(s)
            </p>
          </div>
          <div className="flex flex-col justify-center items-center p-2xs">
            <div className="flex flex-col justify-between grow">
              <h4 className="mt-2xs text-step-0 font-semibold">
                {
                  service.packages.find(
                    (option) => option.amount === chosenPackage.amount,
                  )?.weekTurnaround
                }
              </h4>
              <p className="text-step-000 font-semibold mt-2xs">
                Week turnaround
              </p>
            </div>
          </div>
        </div>
        <h4 className="box text-center font-semibold text-step-4 mt-zero">
          {
            chosenPackage.price.find(
              (option) => option.method === distribution.value,
            )?.value
          }
        </h4>
      </div>
    </li>
  );
};

export default PriceCard;
