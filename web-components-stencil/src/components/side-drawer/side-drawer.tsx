import { Component, h, Prop, State, Method } from '@stencil/core';

@Component({
  tag: 'uc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true,
})
export class SideDrawer {
  @State() showContactInfo = false;
  @Prop({ reflectToAttr: true }) title: string;
  @Prop({ reflectToAttr: true, mutable: true }) opened: boolean;

  onCloseDrawer = () => {
      console.log("onCloseDrawer")
    this.opened = false;
  };

  onContentChange = (content: string) => {
    return () => {
      this.showContactInfo = content === 'contact';
    };
  };

  @Method()
  open() {
    this.opened = true;
  }

  render() {
    let mainContent = <slot />;
    if (this.showContactInfo) {
      mainContent = (
        <div id="contact-information">
          <h2>Contact Information</h2>
          <p>You can reach us via phone or email.</p>
          <ul>
            <li>Phone 47998000</li>
            <li>
              Email: <a href="mailto:something@something.com">something@something.com</a>
            </li>
          </ul>
        </div>
      );
    }
    return [
      <div class="backdrop" onClick={this.onCloseDrawer} />,
      <aside>
        <header>
          <h1>{this.title}</h1>
          <button class="close-icon" onClick={this.onCloseDrawer}>
            X
          </button>
        </header>
        <section id="tabs">
          <button class={!this.showContactInfo ? 'active' : ''} onClick={this.onContentChange('nav')}>
            Navigaton
          </button>
          <button class={this.showContactInfo ? 'active' : ''} onClick={this.onContentChange('contact')}>
            Contact
          </button>
        </section>
        <main>{mainContent}</main>
      </aside>,
    ];
  }
}
