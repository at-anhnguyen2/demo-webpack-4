import './index.scss';

const helloWorld = () => {
  const divEl = document.createElement('div');
  divEl.className = 'hello-world-div';
  divEl.innerHTML = 'Hello World!!!';
  return divEl;
}

document.body.appendChild(helloWorld());
