import React, { Component, PureComponent } from "react";
import Select from "react-select";

import chroma from "chroma-js";
const SelectorContainer = React.memo(
  ({ handleSelect, values, customFilter }) => {
    const options = [
      {
        hexcolor: "#ff0000",
        value: "8",
        label: "Millbrae/Daly City - Richmond",
      },
      {
        hexcolor: "#ff0000",
        value: "7",
        label: "Richmond - Daly City/Millbrae",
      },
      {
        hexcolor: "#339933",
        value: "6",
        label: "Daly City - Berryessa/North San Jose",
      },
      {
        hexcolor: "#339933",
        value: "5",
        label: "Berryessa/North San Jose - Daly City",
      },
      {
        hexcolor: "#ff9933",
        value: "4",
        label: "Richmond - Berryessa/North San Jose",
      },
      {
        hexcolor: "#ff9933",
        value: "3",
        label: "Berryessa/North San Jose - Richmond",
      },
      {
        hexcolor: "#ffd500",
        value: "2",
        label: "Millbrae/SFIA - Antioch",
      },
      {
        value: "1",
        label: "Antioch - SFIA/Millbrae",
        hexcolor: "#ffd500",
      },
    ].reverse();
    function handleChange(value) {
      handleSelect(value);
    }

    const customStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "black",
        textOverflow: "ellipsis",
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.hexcolor);
        return {
          ...styles,
          backgroundColor: isDisabled
            ? null
            : isSelected
            ? data.hexcolor
            : isFocused
            ? color.alpha(0.1).css()
            : null,
          color: isDisabled
            ? "#000"
            : isSelected
            ? chroma.contrast(color, "black") > 2
              ? "black"
              : "black"
            : data.hexcolor,
          cursor: isDisabled ? "not-allowed" : "default",

          ":active": {
            ...styles[":active"],
            backgroundColor:
              !isDisabled &&
              (isSelected ? data.hexcolor : color.alpha(0.3).css()),
          },
        };
      },
      multiValue: (styles, { data }) => {
        const color = chroma(data.hexcolor);
        return {
          ...styles,
          backgroundColor: color.alpha(0.1).css(),
        };
      },
      multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.hexcolor,
      }),
      placeholder: (styles, { data }) => ({
        ...styles,
        color: "silver",
        fontFamily: "Roboto,Arial,sans-serif",
        fontSize: "15px",
        whiteSpace: "nowrap",
      }),
      multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.hexcolor,
        ":hover": {
          backgroundColor: data.hexcolor,
          color: "white",
        },
      }),

      menu: (provided) => ({
        ...provided,
        zIndex: 9999,
        backgroundColor: "black",
      }),
    };

    return (
      <div className="react-select__menu">
        <Select
          options={options}
          isMulti
          autosize={true}
          values={values}
          styles={customStyles}
          placeholder={"Select a single or multiple BART lines to track"}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(val) => handleChange(val)}
        />
      </div>
    );
  }
);

export default SelectorContainer;
