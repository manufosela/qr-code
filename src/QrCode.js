import { LitElement, html, css } from 'lit';
import { QRCodeGenerator } from '@manufosela/qr-code-generator';

/**
 * `qr-code`
 * QrCode
 *
 * @customElement qr-code
 * @polymer
 * @litElement
 * @demo demo/index.html
 */

export class QrCode extends LitElement {
  static get is() {
    return 'qr-code';
  }

  static get properties() {
    return {
      qrImg: { type: String },
      text: {
        type: String,
        converter(value) {
          return value.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
        }
      },
      showtext: { type: Boolean },
      typeNumber: { type: Number },
      errorCorrectLevel: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      #qr {
        width: fit-content;
      }
      .error {
        width: 246px;
        height: 206px;
        margin: 20px;
        font-size: 2rem;
        border: 10px solid black;
        text-align: center;
        padding-top: 20px;
      }
      .error div { font-size: 1rem;}
      .qrtext {
        font-weight:bold;
        margin: 5px auto; 
        text-align: center;
      }
    `;
  }

  constructor() {
    super();
    this.text = '';
    this.showtext = false;
    this.typeNumber = 4;
    this.errorCorrectLevel = 'L';
  }

  setShowText(showText) {
    this.showtext = showText;
  }

  _showText() {
    if (this.showtext) {
      const textLayer = document.createElement('div');
      textLayer.className = 'qrtext';
      textLayer.textContent = this.text;
      this.shadowRoot.querySelector('#qr').append(textLayer);
    }
  }

  createQrcode() {
    const qr = new QRCodeGenerator(this.typeNumber, this.errorCorrectLevel);
    try {
      qr.addData(this.text);
      qr.make();
      this.qrImg = qr.createImgTag();
      this.shadowRoot.querySelector('#qr').innerHTML = this.qrImg;
      this._showText();
    } catch (err) {
      console.log('ERROR', err);
      this.shadowRoot.querySelector('#qr').innerHTML = `<div class="error">Parámetros incorrectos<div>${err.message}</div></div>`;
    }
  }

  updateQrcode(text, typeNumber, errorCorrectLevel) {
    this.typeNumber = (typeof typeNumber === 'undefined') ? this.typeNumber : typeNumber;
    this.errorCorrectLevel = (typeof errorCorrectLevel === 'undefined') ? this.errorCorrectLevel : errorCorrectLevel;
    this.text = text;
    this.createQrcode();
  }

  firstUpdated() {
    if (this.text !== '') {
      this.createQrcode();
    }
  }

  render() {
    return html`
      <div id="qr"></div>
    `;
  }
}
