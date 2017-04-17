/*jshint esversion: 6 */

import React, {Component} from "react";
import $ from 'jquery';

class Exchange extends Component {

    constructor(props) {
        super(props);

        this.state = {
            base : "",
            rates : {},
            convert: "",
            convertresult : "",
            date: ""
        };
    }

    search = () => {
        let url = "http://api.fixer.io/latest?base=";
        url += this.state.base;

        $.ajax({
            url: url,
            method: 'GET',
        }).done((result) => {
            // console.log(result);
            let date = result.date;
            let rates = result.rates;

            this.setState({
                date : date,
                rates : rates
            }, function() {
                this.displayResult();
            });
        });
    };

    updateBase = (e) => {
        this.setState({ base : e.target.value}, function() {
            this.search();
        });

    };

    displayResult = ()=> {

        let rate =  this.state.rates[this.state.convert];
        if (rate === undefined) rate = 1;

        this.setState({convertresult:rate}, function() {
            console.log(this.state);
        });
    };

    updateConvert = (e) => {
        this.setState({convert : e.target.value}, function() {
            this.search();
        });
    };

    render() {

        return (
            <div className="container">

            <div className="selections">
                <select id="baseSelection" name="base-currency" onChange={this.updateBase} >
                    <option disabled selected>Currency</option>
                    <option value="USD">US Dollar</option>
                    <option value="GBP">British Pound</option>
                    <option value="CNY">Chinese Yuan</option>
                    <option value="CAD">Canadian Dollar</option>
                    <option value="EUR">Euro</option>
                    <option value="JPY">Japanese Yen</option>
                    <option value="AUD">Australian Dollar</option>
                    <option value="NZD">New Zealand Dollar</option>
                    <option value="MXN">Mexican New Peso</option>
                    <option value="BRL">Brazilian Real</option>
                    <option value="HKD">Hong Kong Dollar</option>
                    <option value="SGD">Singapore Dollar</option>
                    <option value="KRW">Korean Won</option>
                    <option value="THB">Thailand Baht</option>
                    <option value="PHP">Philippines Peso</option>
                    <option value="DKK">Danish Krone</option>
                    <option value="NOK">Norwegian Krone</option>
                </select>

                <select id="convertSelection" name="convert-currency" onChange={this.updateConvert}>
                    <option disabled selected>Currency</option>
                    <option value="USD">US Dollar</option>
                    <option value="GBP">British Pound</option>
                    <option value="CNY">Chinese Yuan</option>
                    <option value="CAD">Canadian Dollar</option>
                    <option value="EUR">Euro</option>
                    <option value="JPY">Japanese Yen</option>
                    <option value="AUD">Australian Dollar</option>
                    <option value="NZD">New Zealand Dollar</option>
                    <option value="MXN">Mexican New Peso</option>
                    <option value="BRL">Brazilian Real</option>
                    <option value="HKD">Hong Kong Dollar</option>
                    <option value="SGD">Singapore Dollar</option>
                    <option value="KRW">Korean Won</option>
                    <option value="THB">Thailand Baht</option>
                    <option value="PHP">Philippines Peso</option>
                    <option value="DKK">Danish Krone</option>
                    <option value="NOK">Norwegian Krone</option>
                </select>
                </div>

                <div className="display">
                    <p id="baseDisplay"> 1 {this.state.base} </p>
                    <p id="equals"> = </p>
                    <p id="convertedRate">{this.state.convertresult}</p>
                    <p id="convertDisplay"> {this.state.convert} </p>

                    <p id="date">On date: {this.state.date}</p>
                    <p id="credit">Data from <a href="http://fixer.io/">Fixer.io</a> API </p>
                </div>

            </div>

        )
    }

}

export default Exchange;
