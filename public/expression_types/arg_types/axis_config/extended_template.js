import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { set } from 'object-path-immutable';
import { LabeledInput } from '../../../components/labeled_input';

const defaultExpression = {
  type: 'expression',
  chain: [
    {
      type: 'function',
      function: 'axisConfig',
      arguments: {},
    },
  ],
};

export class ExtendedTemplate extends React.PureComponent {
  static propTypes = {
    onValueChange: PropTypes.func.isRequired,
    argValue: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        chain: PropTypes.array,
      }).isRequired,
    ]),
    typeInstance: PropTypes.object.isRequired,
  };

  // TODO: this should be in a helper, it's the same code from container_style
  getArgValue = (name, alt) => {
    return get(this.props.argValue, ['chain', 0, 'arguments', name, 0], alt);
  };

  // TODO: this should be in a helper, it's the same code from container_style
  setArgValue = name => ev => {
    const val = ev.target.value;
    const { argValue, onValueChange } = this.props;
    const oldVal = typeof argValue === 'boolean' ? defaultExpression : argValue;
    const newValue = set(oldVal, ['chain', 0, 'arguments', name, 0], val);
    onValueChange(newValue);
  };

  render() {
    const isDisabled = typeof this.props.argValue === 'boolean' && this.props.argValue === false;

    if (isDisabled)
      return <div className="canvas__argtype--axis_config--disabled">The axis is disabled</div>;

    const positions = {
      xaxis: ['bottom', 'top'],
      yaxis: ['left', 'right'],
    };
    const argName = this.props.typeInstance.name;
    const position = this.getArgValue('position', positions[argName][0]);

    return (
      <div className="canvas__argtype--axis_config--configure">
        <LabeledInput
          type="select"
          className="position"
          label="Position"
          value={position}
          values={positions[argName]}
          onChange={this.setArgValue('position')}
        />
      </div>
    );
  }
}

ExtendedTemplate.displayName = 'AxisConfigExtendedInput';
