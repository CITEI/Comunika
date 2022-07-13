import React, { useEffect, useMemo, useState } from "react";
import { BasePropertyComponent, EditPropertyProps } from "adminjs";

/**
 * ConditionalProperty custom
 */
export interface ConditionalPropertyCustom {
  /** path to the dependant field */
  dependency: string | undefined;
  /** array of valid values to enable this field */
  isin: any[] | undefined;
  /** makes the property visible when it is first created */
  initial_state: boolean | undefined;
}

/**
 * A regular AdminJS component that deactivates given another property value
 */
const ConditionalProperty: React.FC<EditPropertyProps> = (props) => {
  const { property, record } = props;
  const { custom } = property;
  const { dependency, isin, initial_state } =
    custom as ConditionalPropertyCustom;
  const [isConditionallyVisible, setIsConditionallyVisible] = useState(
    initial_state || false
  );
  const [checkPath, setCheckPath] = useState(dependency);

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
    if (dependency) {
      // get the component path
      const selfParts = property.path.split(".");
      // check what . divided subparts are array indexes
      const positions = selfParts.filter((val) => {
        const parsed = Number(val);
        if (!isNaN(parsed)) return true;
        return false;
      });

      // if it is nested, check dependency
      if (positions.length > 0) {
        let parts = dependency.split(".");
        // if $ in dependency, change it to the position specified
        let marker_count = -1;
        parts = parts.map((val) => {
          if (val == "$") {
            marker_count++;
            return positions[marker_count];
          }
          return val;
        });
        setCheckPath(parts.join("."));
      }
    }
  }, [dependency]);

  /**
   * Deactivates a property
   */
  useEffect(() => {
    if (isin && checkPath) {
      if (!checkPath.includes("$")) {
        const val = record.params[checkPath];
        let enabled = isConditionallyVisible;
        if (val) enabled = isin.includes(val);
        else enabled = false;

        setIsConditionallyVisible(enabled);
        if (!enabled && record.params[property.path])
          delete record.params[property.path];
      }
    }
  }, [record, checkPath]);

  /**
   * Properties to be passed for the nested AdminJS component
   */
  const cleanProperty = useMemo(
    () => ({
      ...property,
      components: {},
      isVisible: isConditionallyVisible,
    }),
    [record, property]
  );

  const BaseComponent = BasePropertyComponent as any;

  return (
    <div style={{ display: isConditionallyVisible ? "block" : "none" }}>
      {props.children ? (
        props.children
      ) : (
        <BaseComponent
          {...props}
          property={cleanProperty}
          key={String(isConditionallyVisible)}
        />
      )}
    </div>
  );
};

export default ConditionalProperty;
