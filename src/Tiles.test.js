import React from 'react';
import {expect} from 'chai';
import {shallow, mount, render} from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tiles from './components/Tiles';

configure({ adapter: new Adapter() });

describe('Enzyme Shallow', function () {
  it('Tiles should render tiles ', function () {
    let app = shallow(<Tiles/>);
    // console.log(app.find('div'));
    expect(app.find(Tiles));
  });
});


describe('Enzyme Shallow', function () {
  it('Tiles\'s className should be Clash-title ', function () {
    let app = shallow(<Tiles/>);
    // console.log(app.find('div'));
    expect(app.find("div").at(0).hasClass("clash-tile"));
  });
});

describe('Enzyme Shallow', function () {
  it('Tiles\'s should have height 0 before start ', function () {
    let app = shallow(<Tiles/>);
    // console.log(app.find('div'));
    expect(app.find("height").length).to.equal(0);
  });
});

describe('Enzyme Render to test tiles size', function () {
    it('Testing  Initial Grid size', function () {
        let app = shallow(<Tiles/>);
     expect(app.find('gridSize').length).to.lessThan(1);
     // console.log(app.find('.div').at(0));
      });
      it('Testing  Initial Tile size', function () {
          let app = shallow(<Tiles/>);
       expect(app.find('tileSize').length).to.lessThan(1);
       // console.log(app.find('.div').at(0));
        });

        it('Testing  Tile render', function () {
            let app = shallow(<Tiles/>);
         expect(app.find('tileRender').length).to.lessThan(1);
         // console.log(app.find('.div').at(0));
          });

});


