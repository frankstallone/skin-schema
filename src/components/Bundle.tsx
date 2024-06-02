import { useState } from 'react';
import Select from 'react-select';
import classNames from 'classnames';

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
    return classNames('p-2xs', state.isFocused ? 'bg-skin-200' : '');
  },
};

const distributionMethods = [
  { value: 'you', label: 'For Brand Use' },
  { value: 'me', label: 'Shared by Skin Schema' },
];
const prices = [
  { value: 'you', label: '$1000' },
  { value: 'me', label: '$1200' },
];

const PriceCard = () => {
  const [distribution, setDistribution] = useState(distributionMethods[0]);

  const handleSetDistribution = (e: any) => {
    setDistribution(e);
  };

  const currentPrice = prices.find(
    (option) => option.value === distribution.value,
  );

  return (
    <div className="border border-gray-600 flex flex-col justify-between w-fit mx-auto drop">
      <div className="box flow prose text-step-00">
        <p className="mt-zero">
          Get a suite of extremely high-quality photographic and video content
          that beautifully showcases your brand, a select product, or a range of
          products. This comprehensive bundle includes:
        </p>
        <ul>
          <li>5 Videos</li>
          <li>5 Professional Photos</li>
          <li>2 Hooks</li>
          <li>1 Call to Action (CTA)</li>
        </ul>
      </div>
      <div
        style={
          {
            '--gutter': 0,
            '--switcher-target-container-width': '20rem',
          } as React.CSSProperties
        }
        className="flex justify-center items-center divide-x divide-gray-600 border-t border-t-gray-600"
      >
        <div className="flex flex-col justify-center items-center p-2xs grow">
          <div className="flex justify-center items-center font-semibold font-mono w-full">
            <Select
              defaultValue={distribution}
              onChange={handleSetDistribution}
              options={distributionMethods}
              className="text-step-0 w-full text-center"
              unstyled
              classNames={selectClassNamesOptions}
            />
          </div>
          <p className="text-step-000 font-semibold mt-2xs">
            Distribution method
          </p>
        </div>
        <div className="flex flex-col justify-center items-center p-l py-2xs">
          <h4 className="text-center font-semibold font-mono text-step-4 mt-zero">
            {currentPrice?.label}
          </h4>
          <p className="text-step-000 font-semibold mt-2xs">
            3 week turnaround
          </p>
        </div>
      </div>
      <div className="border-t border-t-gray-600">
        <div className="box w-fit mx-auto">
          <a href="/#Contact" className="button">
            Reach out
          </a>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
