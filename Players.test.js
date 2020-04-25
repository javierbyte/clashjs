import React from 'react';
import {expect} from 'chai';
import {shallow, mount, render} from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Clash from './components/Clash';
import Tiles from './components/Tiles';
import Players from './components/Players';



configure({ adapter: new Adapter() });

describe('Enzyme Render to test players', function () {
  it('Testing 1st player name is not empty', function () {
      let app = mount(<Clash/>);
   expect(app.find('.clash-player-name').at(0).text()).to.contain("");
    });
  it(' Testing 2nd player name is not empty', function () {
        let app = mount(<Clash/>);
     expect(app.find('.clash-player-name').at(1).text()).to.contain("") ;
      });

      it(' Testing 3rd player name is not empty', function () {
        let app = mount(<Clash/>);
        expect(app.find('.clash-player-name').at(2).text()).to.contain("") ;
      });

      it(' Testing 4th player name is not empty', function () {
        let app = mount(<Clash/>);
        expect(app.find('.clash-player-name').at(3).text()).to.contain("") ;
      });

      it(' Testing 5th player name is not empty', function () {
        let app = mount(<Clash/>);
        expect(app.find('.clash-player-name').at(4).text()).to.contain("") ;
      });

      it(' Testing 6th player name is not empty', function () {
        let app = mount(<Clash/>);
        expect(app.find('.clash-player-name').at(5).text()).to.contain("") ;
      });

      it(' Testing 7th player name is not empty', function () {
        let app = mount(<Clash/>);
        expect(app.find('.clash-player-name').at(6).text()).to.contain("") ;
      });

  });

  describe('Enzyme Render to test Player function', function () {
    it('Testing Player properties where Player Instances contains PlayerAI function', function () {
      let app = shallow(<Clash/>);
      expect(app.find(Players).simulate('playerInstances', '[_playerAI]'));
    });

    it('Testing Player properties where Player Instances contains ID', function () {
      let app = shallow(<Clash/>);
      expect(app.find(Players).simulate('playerInstances', '_id'));
    });
    it('Testing Player properties where Player states contain Ammo', function () {
        let app = shallow(<Clash/>);
     expect(app.find(Players).simulate('playerStates', 'ammo'));
      });

      it('Testing Player properties where Player states contain Direction', function () {
          let app = shallow(<Clash/>);
       expect(app.find(Players).simulate('playerStates', 'direction'));
        });

        it('Testing Player properties where Player states contain IsAlive', function () {
            let app = shallow(<Clash/>);
         expect(app.find(Players).simulate('playerStates', 'isAlive'));
          });


    });
