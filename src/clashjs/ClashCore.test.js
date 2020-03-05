import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { shallow, render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
// import TestUtils from 'react-addons-test-utils'

import {ClashJS} from './ClashCore';
jest.mock('./ClashCore');


// Enzyme.configure({ adapter: new Adapter() })
//
it('should return the product', async () => {
  const ClashTestClass =  new ClashJS();
  const result = ClashTestClass.getState(); // Will throw error!
  const CreateAmmo = ClashTestClass._createAmmo();
  const expectedProduct = {
    "_createAmmo": '[Function $createAmmo]',
    "_getAlivePlayerCount": '[Function $getAlivePlayerCount]',
    "_handleCoreAction": '[Function $handleCoreAction]',
    "_savePlayerAction": '[Function $savePlayerAction]',
    "getState": '[Function getState]',
    "nextPly": '[Function nextPly]',
    "setupGame": '[Function setupGame]'

  };
  console.log(ClashTestClass);
  // console.log(CreateAmmo);
  // expect(result).toBeTruthy();
  expect(ClashTestClass).toBeTruthy();
});

//
// describe('ClashJS', () => {
//     it('should exist', () => {
//         expect(ClashJS).toExist()
//     });
