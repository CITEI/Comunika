import React, { useEffect, useMemo, useState } from "react";
import { BasePropertyComponent, EditPropertyProps } from "adminjs";

/**
 * ConditionalProperty custom
 */
interface ConditionalPropertyProps extends EditPropertyProps {
  /** path to the dependant field */
  dependency: string;
  /** array of valid values to enable this field */
  isin: any[];
}

/**
 * A regular AdminJS component that deactivates given another property value
 */
const ConditionalProperty: React.FC<EditPropertyProps> = (props) => {
  const { property, record } = props;
  const { custom } = property;
  const { dependency, isin } = custom as ConditionalPropertyProps;
  const [isConditionallyVisible, setIsConditionallyVisible] = useState(false)
  const [checkPath, setCheckPath] = useState(dependency)

  /**
   * Fixes nested dependencies
   * e.g.
   * nodes.<i>.text is only visible if nodes.<i>.type == 'text'
   * if i == 1:
   *  this component path would be nodes.1.text
   *  and it should check nodes.1.type.
   * this code takes the 1 from this component path and applies it to the
   * dependency by using a $ notation i.e. nodes.$0.type
   */
  useEffect(() => {
    // get the component path
    const selfParts = property.path.split('.')
    // check what . divided subparts are array indexes
    const positions = selfParts.filter((val) => {
      const parsed = Number(val)
      if (!isNaN(parsed))
        return true
      return false
    });

    // if it is nested, check dependency
    if (positions.length > 0) {
      let parts = dependency.split('.')
      // if $ in dependency, change it to the position specified
      parts = parts.map((val) => {
        if (val.startsWith('$')) {
          const i = val.substring(1) // removes $
          return positions[i]
        }
        return val;
      })
      setCheckPath(parts.join('.'))
    }
  }, [dependency])

  /**
   * Deactivates a property
   */
  useEffect(() => {
    if (!checkPath.includes('$')) {
      const val = record.params[checkPath];
      let enabled = isConditionallyVisible;
      if (val) enabled = isin.includes(val);
      else enabled = false;

      setIsConditionallyVisible(enabled);
      if (!enabled && record.params[property.path])
        delete record.params[property.path]
    }
  }, [record, checkPath])

  /**
   * Properties to be passed for the nested AdminJS component
   */
  const cleanProperty = useMemo(() => ({
    ...property,
    components: {},
    isVisible: isConditionallyVisible
  }), [record, property])

  const BaseComponent = BasePropertyComponent as any;

  return (
    <div style={{display: isConditionallyVisible ? 'block' : 'none'}}>
      <BaseComponent
        {...props}
        property={cleanProperty}
        key={String(isConditionallyVisible)}
      />
    </div>
  );
};

export default ConditionalProperty;
