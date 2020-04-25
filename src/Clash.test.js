import React from 'react';
import {expect} from 'chai';
import {shallow, mount, render} from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Clash from './components/Clash';
import Tiles from './components/Tiles';

configure({ adapter: new Adapter() });



describe('Enzyme Shallow', function () {
  it('Clash\'s className should be clash', function () {
    let app = shallow(<Clash/>);
	expect(app.find('div').at(0).hasClass('clash')).to.equal(true);
  });
});

describe('Enzyme Render', function () {
  it('The number of tiles is equal to 169', function () {
    let app = render(<Clash/>);
	expect(app.find('.clash-tile').length).to.equal(169);
  });

  it('The number of players at initialization is 7', function () {
    let app = render(<Clash/>);
	expect(app.find('.clash-player').length).to.equal(7);
  });

 it('The number of Ammos at initialization is 1', function () {
    let app = render(<Clash/>);
	expect(app.find('.clash-ammo').length).to.equal(1);
  });

  it('The number of Shoots at initialization is 0', function () {
    let app = render(<Clash/>);
	expect(app.find('.clash-shoot').length).to.equal(0);
  });

   it('No notification exists at initialization', function () {
    let app = render(<Clash/>);
	expect(app.find('.notifications').length).to.equal(0);
  });
});

describe('Enzyme Mount', function () {
  it('Total 20 rounds', function () {
    let app = mount(<Clash/>);
	expect(app.find('.stats').at(0).text()).to.contain("20");
  });

  it('The current level is 1 when initialized', function () {
    let app = mount(<Clash/>);
	expect(app.find('.stats').at(0).text()).to.contain("1");
  });

});
