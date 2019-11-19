import WindowedSelect from "react-windowed-select";
import React, { Component, PureComponent } from "react";
import { components, createFilter } from "react-windowed-select";
import Select from "react-select";
import { css } from "@emotion/core";
import { throws } from "assert";
import chroma from "chroma-js";
const SelectorContainer = React.memo(
  ({ handleSelect, values, customFilter }) => {
    const options = [
      {
        hexcolor: "#ff0000",
        value: "8",
        label: "Millbrae/Daly City - Richmond"
      },
      {
        hexcolor: "#ff0000",
        value: "7",
        label: "Richmond - Daly City/Millbrae"
      },
      {
        hexcolor: "#339933",
        value: "6",
        label: "Daly City - Warm Springs/South Fremont"
      },
      {
        hexcolor: "#339933",
        value: "5",
        label: "Warm Springs/South Fremont - Daly City"
      },
      {
        hexcolor: "#ff9933",
        value: "4",
        label: "Richmond - Warm Springs/South Fremont"
      },
      {
        hexcolor: "#ff9933",
        value: "3",
        label: "Warm Springs/South Fremont - Richmond"
      },
      {
        hexcolor: "#ffd500",
        value: "2",
        label: "Millbrae/SFIA - Antioch"
      },
      {
        value: "1",
        label: "Antioch - SFIA/Millbrae",
        hexcolor: "#ffd500"
      }
    ];
    function handleChange(value) {
      handleSelect(value);
    }
    console.log(options);
    const customStyles = {
      control: styles => ({ ...styles, backgroundColor: "black" }),
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
              (isSelected ? data.hexcolor : color.alpha(0.3).css())
          }
        };
      },
      multiValue: (styles, { data }) => {
        const color = chroma(data.hexcolor);
        return {
          ...styles,
          backgroundColor: color.alpha(0.1).css()
        };
      },
      multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.hexcolor
      }),
      multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.hexcolor,
        ":hover": {
          backgroundColor: data.hexcolor,
          color: "white"
        }
      }),
      // option: (provided, state) => ({
      //   ...provided,
      //   borderBottom: "1px dotted pink",
      //   color: state.isSelected ? "red" : "blue"
      //   //padding: 20
      // }),
      // control: () => ({
      //   // none of react-select's styles are passed to <Control />
      //   width: 200
      // }),
      menu: provided => ({
        ...provided,
        zIndex: 9999,
        backgroundColor: "black"
      })
      // singleValue: (provided, state) => {
      //   const opacity = state.isDisabled ? 0.5 : 1;
      //   const transition = "opacity 300ms";

      //   return { ...provided, opacity, transition };
      // }
    };

    //   function customFilter() {
    //     createFilter({ ignoreAccents: false });
    //   }

    return (
      <div className="react-select__menu">
        <WindowedSelect
          options={options}
          isMulti
          autosize={true}
          values={values}
          // styles={{ marginBottom: "200px" }}
          styles={
            // Fixes the overlapping problem of the component
            customStyles
          }
          placeholder={"Select BART lines to track"}
          className="basic-multi-select"
          classNamePrefix="select"
          //filterOption={customFilter}
          onChange={handleChange}
        />
      </div>
    );
  }
);

export default SelectorContainer;
