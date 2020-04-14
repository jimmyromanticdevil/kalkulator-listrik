import React, { Component } from "react";
import "./App.css";
import FormSettings from "./components/FormSettings";
import CardList from "./components/CardList";
import FormItems from "./components/FormItems";
import Details from "./components/Details";
import HeaderMenu from "./components/Header";
import { Layout, Row, Divider } from "antd";

const { Content } = Layout;

class App extends Component {
  state = {
    dataItem: [],
    rates: 1467,
    result: {},
  };

  formatCurrency = (props) => new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(parseFloat(props).toFixed(2)); 
  

  calculateRate = (props) => {
    if (props.length >= 1 && this.state.rates > 0) {
      const total = props.reduce(
        (prev, next) => prev + next.itemWatt * next.itemHour,
        0
      );
      const rates = this.formatCurrency(this.state.rates);
      const kwh = total / 1000;
      const dailyKwh = kwh * 1;
      const monthlyKwh = parseFloat(dailyKwh * 30).toFixed(2);
      const yearlyKwh = parseFloat(monthlyKwh * 12).toFixed(2);
      const baseDailyRate = parseFloat(dailyKwh * this.state.rates).toFixed(2);
      const dailyRate = this.formatCurrency(baseDailyRate);
      const monthlyRate = this.formatCurrency(baseDailyRate * 30);
      const yearlyRate = this.formatCurrency(baseDailyRate * 360);
      
      this.setState({
        result: {
          total,
          rates,
          kwh,
          dailyKwh,
          monthlyKwh,
          yearlyKwh,
          dailyRate,
          monthlyRate,
          yearlyRate,
        },
      });
    }
  };

  addNewProfile = (formData) => {
    this.setState((prevState) => ({
      dataItem: [...prevState.dataItem, formData],
    }));
    this.calculateRate(this.state.dataItem);
  };

  electricityRates = (props) => {
    this.setState(
      {
        rates: props.rates,
      },
      () => this.calculateRate(this.state.dataItem)
    );
  };

  removeItems = (index) => {
    const items = this.state.dataItem.filter((item) => item.id !== index);
    items.map((item, index) => (item.id = index));
    this.setState({ dataItem: items });
    this.setState({ result: {} });
    this.calculateRate(items);
  };

  render() {
    return (
      <Layout className="layout">
        <HeaderMenu/>
        <Content style={{ margin: "24px 16px 0" }}>
          <div className="site-layout-content" style={{ padding: 24 }}>
            <FormSettings onSubmit={this.electricityRates} />
            <Divider dashed />
            <FormItems onSubmit={this.addNewProfile} />
          </div>
          <div className="site-card-wrapper">
            <Row gutter={[18, 24]}>
              {this.state.dataItem.map((item) => (
                <CardList
                  removeItems={this.removeItems}
                  key={item.id}
                  {...item}
                />
              ))}
            </Row>
          </div>
        </Content>
        <Content style={{ margin: "24px 16px 0" }}>
          <div className="site-layout-content" style={{ padding: 24 }}>
            <Details result={this.state.result} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default App;
