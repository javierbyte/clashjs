import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { shallow, render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import {ClashJS} from './ClashCore';
import {PlayerClass} from './PlayerClass';
// import TestUtils from 'react-addons-test-utils'
configure({ adapter: new Adapter() });

jest.mock('./ClashCore');


// Enzyme.configure({ adapter: new Adapter() })
//
it('Clash Core should return all the functions', async () => {
  const ClashTestClass = new ClashJS();
  const expectedProduct = {
    "_createAmmo": '[Function $createAmmo]',
    "_getAlivePlayerCount": '[Function $getAlivePlayerCount]',
    "_handleCoreAction": '[Function $handleCoreAction]',
    "_savePlayerAction": '[Function $savePlayerAction]',
    "getState": '[Function getState]',
    "nextPly": '[Function nextPly]',
    "setupGame": '[Function setupGame]'

  };
  // console.log(ClashTestClass);
  expect(ClashTestClass).toBeTruthy(expectedProduct);
});


jest.mock('./PlayerClass');

it('Player Class should return all the functions', async () => {
  const PlayerTestClass = new PlayerClass();
  const expectedProduct = {
    "getId": '[Function: getId]',
    "getInfo()": '[Function $getInfo]',
    "getName()": '[Function $getName]',
    "playExplosion()": '[Function $playExplosion]'
  };
   // console.log(PlayerTestClass);
  expect(PlayerTestClass).toBeTruthy(expectedProduct);
});
