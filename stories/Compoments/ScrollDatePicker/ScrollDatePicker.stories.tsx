import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ScrollDatePicker from './index';
import { useArgs } from '@storybook/preview-api';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ScrollDatePicker',
  component: ScrollDatePicker,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
} satisfies Meta<typeof ScrollDatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    value: '',
    onChange: () => {},
    showYear: true,
    id: '1',
    name: 'input ',
    // className,
    placeholder: 'Select a date',
    listHeight: 196,
    // Need to be an odd number to work correctly
    numberOfElementInView: 7,
    modalWidth: 180,
    placement: 'bottom',
    showClearDate: true,
  },

  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs();

    function handleChange(dateStr: string) {
      updateArgs({ value: dateStr });
    }

    return <ScrollDatePicker {...args} onChange={handleChange} value={value} />;
  },
};
