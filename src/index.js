import $ from 'jquery';
import './style.scss';

let num = 0;
const Counter = () => {
  num++;
  $('#main').html(`You've been on this page for ${num} seconds.`);
};

setInterval(Counter, 1000);
