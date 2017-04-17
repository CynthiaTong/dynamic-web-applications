import React, {Component} from "react";
import $ from 'jquery';

class Exchange extends Component {

    constructor(props) {
        super(props);

        this.state = {
            base : "USD",
            rates : {},
            convert: "USD"
        }
    }

    updateBase = (e) => {
        // console.log(e.target.value);
        this.setState({
            base : e.target.value
        });
    }

    updateConvert = (e) => {
        this.setState({
            convert : e.target.value
        });
    }

    render() {

        return (
            <div className="container">

                <h2> Currency Converter </h2>

                <select id="baseSelection" name="base-currency" value={this.state.base} onChange={this.updateBase} >
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

                <select id="convertSelection" name="convert-currency" value={this.state.convert} onChange={this.updateConvert}>
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

                <p id="baseDisplay"> 1 {this.state.base} </p>
                <p id="equals"> = </p>
                <p id="convertedRate"></p>
                <p id="convertDisplay"> {this.state.convert} </p>


            </div>

        )
    }

}

export default Exchange;
