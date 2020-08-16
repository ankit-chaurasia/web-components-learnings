import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'uc-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;
  @State() searchResults: { symbol: string; name: string }[] = [];
  @State() loading = false;

  @Event({ bubbles: true, composed: true }) ucSymbolSelected: EventEmitter<string>;

  onFindStocks = async (event: Event) => {
    event.preventDefault();
    this.loading = true;
    const stockName = this.stockNameInput.value;
    try {
      const res = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`);
      const jsonRes = await res.json();
      console.log('json res', jsonRes);
      this.searchResults = jsonRes['bestMatches'].map(match => {
        return {
          name: match['2. name'],
          symbol: match['1. symbol'],
        };
      });
      this.loading = false;
    } catch (err) {
      this.loading = false;
      console.log(err);
    }
  };

  onSelectSymbol = (symbol: string) => {
    this.ucSymbolSelected.emit(symbol);
  };

  render() {
      console.log('this.loading', this.loading)
    return [
      <form onSubmit={this.onFindStocks}>
        <input id="stock-symbol" ref={el => (this.stockNameInput = el)} />
        <button type="submit">Find!</button>
      </form>,
      this.loading ? (
        <uc-spinner />
      ) : (
        <ul>
          {this.searchResults.map(result => (
            <li onClick={() => this.onSelectSymbol(result.symbol)}>
              <strong>{result.symbol}</strong> - {result.name}
            </li>
          ))}
        </ul>
      ),
    ];
  }
}
