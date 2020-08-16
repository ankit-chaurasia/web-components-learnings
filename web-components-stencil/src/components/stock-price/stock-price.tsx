import { Component, h, State, Element, Prop, Watch, Listen } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'uc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement;
  //   initialStockSymbol: string;
  @Element() el: HTMLElement;
  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;
  @State() loading = false;

  @Prop({ mutable: true, reflectToAttr: true }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetchStockPrice(newValue);
    }
  }

  onUserInput = (event: Event) => {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    if (this.stockUserInput.trim() !== '') {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  };

  onFetchStockPrice = async (event: Event) => {
    event.preventDefault();
    // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
    this.stockSymbol = this.stockInput.value;
    // this.fetchStockPrice(stockSymbol);
  };

  componentWillLoad() {
    console.log('componentWillLoad');
    console.log('this,stockSymbol', this.stockSymbol);
  }

  componentDidLoad() {
    if (this.stockSymbol) {
      //   this.initialStockSymbol = this.stockSymbol;
      this.stockUserInput = this.stockSymbol;
      this.stockInputValid = true;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentWillUpdate() {
    console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    // if (this.stockSymbol !== this.initialStockSymbol) {
    //   this.initialStockSymbol = this.stockSymbol;
    //   this.fetchStockPrice(this.stockSymbol);
    // }
  }

  componentDidUnload() {
    console.log('componentDidUnload');
  }

  @Listen('body:ucSymbolSelected')
  onStockSymbolSelected(event: CustomEvent) {
    console.log('Stock symbol selected', event.detail);
    if (event.detail && event.detail !== this.stockSymbol) {
      this.stockInputValid = true;
      this.stockSymbol = event.detail;
    }
  }

  fetchStockPrice = async (stockSymbol: string) => {
    this.loading = true;
    try {
      const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`);
      if (res.status !== 200) {
        throw new Error('Invalid!');
      }
      const json = await res.json();
      console.log('Result', json);
      if (!json['Global Quote']['05. price']) {
        throw new Error('Invalid symbol');
      }
      this.fetchedPrice = +json['Global Quote']['05. price'];
      this.error = null;
      this.loading = false;
    } catch (err) {
      console.error(err);
      this.error = err.message;
      this.fetchedPrice = null;
      this.loading = false;
    }
  };

  hostData() {
    return {
      class: this.error ? 'error' : '',
    };
  }

  render() {
    return [
      <form onSubmit={this.onFetchStockPrice}>
        <input id="stock-symbol" ref={el => (this.stockInput = el)} value={this.stockUserInput} onInput={this.onUserInput} />
        <button type="submit" disabled={!this.stockInputValid || this.loading}>
          Fetch
        </button>
      </form>,
      <div>
        {this.loading ? <uc-spinner></uc-spinner> : this.error ? <p>{this.error}</p> : this.fetchedPrice ? <p>Price: ${this.fetchedPrice}</p> : <p>Please enter a symbol!</p>}
      </div>,
    ];
  }
}
