const typeTable = [
	'Max',
	'Allocation',
	'Need'
];

let n;
let m;
let mArray = [];
let availableArray = [];
let maxArray;
let allocationArray;
let needArray;

function genTable() {
	const addM = document.querySelector('#addM');
	addM.innerHTML = null;
	const addA = document.querySelector('#addA');
	addA.innerHTML = null;
	const addTable = document.querySelector('#addTable');
	addTable.innerHTML = null;
	n = document.querySelector('#n').value;
	m = document.querySelector('#m').value;

	addM.innerHTML += `<input class="unlock pickLock" type="radio" name="unlock" value="m" checked><div>Tài nguyên có</div>`;
	for(var i = 0; i < m; i++) {
		addM.innerHTML += `<input class="convert" type="number" id="m${i}" value="0" onchange="convertRun(this.id.slice(1))">`;
	}

	addA.innerHTML += `<input class="unlock" type="radio" name="unlock" value="a"><div>Available_ có</div>`;
	for(var i = 0; i < m; i++) {
		addA.innerHTML += `<input class="convert" type="number" id="a${i}" value="0" disabled onchange="convertRun(this.id.slice(1))">`;
	}

	for(var iTT = 0; iTT < typeTable.length; iTT++) {
		var table = ``;
		var temp = `<th></th>`;
		for(var i = 0; i < m; i++)
			temp += `<th>R${i}</th>`;
		table += `<tr>${temp}</tr>`;
		temp = ``;

		for(var i = 0; i < n; i++) {
			temp += `<th>P${i}</th>`;
			for(var j = 0; j < m; j++)
				temp += `<td><input class="change" id="i${iTT}_${i}_${j}" type="number" value="0" onchange="convertRun(this.id.slice(5))"></td>`
			table += `<tr>${temp}</tr>`;
			temp = ``;
		}
		table += `<tr><th colspan="${m + 1}">${typeTable[iTT]}</th></tr>`;
		document.querySelector('#addTable').innerHTML += `<table>${table}</table>`;
	}

	const unlock = document.querySelectorAll('.unlock');
	for(var i = 0; i < unlock.length; i++)
		unlock[i].addEventListener('change', unlockRun);

	const change = document.querySelectorAll('.change');
	for(var i = 0; i < change.length; i++)
		change[i].addEventListener('change', genNeed);

	document.querySelector("#addRun").innerHTML = `<button onclick="run()">Tính toán</button>`;
	getArray();
}

function unlockRun() {
	const lock = document.querySelectorAll('.convert');
	const unlock = document.querySelectorAll('.unlock');
	for(var i = 0; i < lock.length; i++) {
		if(lock[i].disabled)
			lock[i].disabled = false;
		else
			lock[i].disabled = true;
	}
	unlock[0].classList.toggle('pickLock');
	unlock[1].classList.toggle('pickLock');
}

function convertRun(id) {
	getArray();
	const pickLock = document.querySelector('.pickLock').value;
	if(pickLock == 'm') {
		const tempV = document.querySelector(`#a${id}`);
		let temp = 0;
		for(var i = 0; i < n; i++)
			temp += allocationArray[i][id];
		availableArray[id] = mArray[id] - temp;
		tempV.value = availableArray[id];
	}
	else {
		const tempV = document.querySelector(`#m${id}`);
		let temp = 0;
		for(var i = 0; i < n; i++)
			temp += allocationArray[i][id];
		mArray[id] = availableArray[id] + temp;
		tempV.value = mArray[id];
	}
}

function genNeed() {
	getArray();
	const newId = this.id.slice(2);
	const maxValue = document.querySelector(`#i0${newId}`).value;
	const allocationValue = document.querySelector(`#i1${newId}`).value;
	const needValue = document.querySelector(`#i2${newId}`);

	needValue.value = maxValue - allocationValue;
}

function getArray() {
	maxArray = new Array(n);
	allocationArray = new Array(n);
	needArray = new Array(n);

	for(var i = 0; i < n; i++) {
		maxArray[i] = new Array(m);
		allocationArray[i] = new Array(m);
		needArray[i] = new Array(m);
		for(var j = 0; j < m; j++) {
			mArray[j] = parseInt(document.querySelector(`#m${j}`).value);
			availableArray[j] = parseInt(document.querySelector(`#a${j}`).value);
			maxArray[i][j] = parseInt(document.querySelector(`#i0_${i}_${j}`).value);
			allocationArray[i][j] = parseInt(document.querySelector(`#i1_${i}_${j}`).value);
			needArray[i][j] = parseInt(document.querySelector(`#i2_${i}_${j}`).value);
		}
	}
}

function run() {
	getArray();
	const final = document.querySelector('#final');
	final.innerHTML = null;

	final.innerHTML += `<li class="warning">Code chán rùi không sửa phần dưới nữa :U</li><li>Thực hiện thuật toán an toàn:</li>`;

	var orderN = [];
	for(var loop = 0; loop < n; loop++) {
		var check = true;
		final.innerHTML += `<br><div>> Lần lặp ${loop + 1}</div>`;

		for(var i = 0; i < n; i++) {
			if(!orderN.includes(i)) {
				for(var j = 0; j < m; j++) {
					if(needArray[i][j] > availableArray[j]) {
						final.innerHTML += `<li>i = ${i} ${genDataArr(needArray[i], m)} > ${genDataArr(availableArray, m)} -> không cấp</li>`;
						check = false;
						break;
					}
				}
				if(check) {
					final.innerHTML += `<li>i = ${i} ${genDataArr(needArray[i], m)} < ${genDataArr(availableArray, m)} -> cấp cho P${i} => P${i} hoàn thành => trả lại ${genDataArr(allocationArray[i], m)} => work(mới) = ${genDataArr(availableArray, m)} + ${genDataArr(allocationArray[i], m)} = ${cal(availableArray, allocationArray[i])}</li>`;
					orderN.push(i);
				}
				check = true;
			}
		}
	}

	final.innerHTML += `<br><li>Hệ thống được trả lại đầy đủ tài nguyên => Hệ thống an toàn P${genDataArr(orderN, n)}</li>`
}

function genDataArr(arr, length) {
	var temp = `${arr[0]}`;
	for(var i = 1; i < length; i++)
		temp += `, ${arr[i]}`;
	return `(${temp})`
}

function genNameArr(name, length) {
	var temp = `${name}0`;
	for(var i = 1; i < length; i++)
		temp += `, ${name}${i}`;
	return `(${temp})`
}

function cal(dataReplace, noReplace) {
	for(var i = 0; i < m; i++)
		dataReplace[i] += noReplace[i];
	return genDataArr(dataReplace, m);
}