
const $ = document.querySelector.bind(document),
$$ = document.querySelectorAll.bind(document),
body = $('body'),
hCardP = $('.header__cart-price'),
form = $('.header__search');

let catalogData,
promocodes,
search,
targetBlock,
buferArr,
switcher = false,
order = {
		"buyer info": {},
		"goods": {},
		"total quantity": 0,
		"total summ": 0,
		"common discount": 0,
		"type payment": "",
		"type delivery": "",
		"services": [],
	},
zIndex = 11,
cart = {},
buyerInfo = {},
chosen = [],
urlSend = 'https://jsonplaceholder.typicode.com/posts',
urlPromo = 'https://raw.githubusercontent.com/AlexG2023/Tattoo-shop/main/data/0catalog/promocodes.json',
urlCatalog = 'https://raw.githubusercontent.com/AlexG2023/Tattoo-shop/main/data/0catalog/tatto-catalog.json',
headers = {'Content-Type': 'application/json'};
buferArr = catalogData;
if(localStorage.getItem('promoValue')
	&&$('[name="promocode"]'))$('[name="promocode"]').value = localStorage.getItem('promoValue');
if(localStorage.getItem('cart')) cart = JSON.parse(localStorage.getItem('cart'));
if(localStorage.getItem('chosen')) chosen = JSON.parse(localStorage.getItem('chosen'));
if(localStorage.getItem('buyerInfo')) buyerInfo = JSON.parse(localStorage.getItem('buyerInfo'));
if(sessionStorage.getItem('orderInfo')) order = JSON.parse(sessionStorage.getItem('orderInfo'));
if(sessionStorage.getItem('search')) search = sessionStorage.getItem('search');
if(sessionStorage.getItem('switcher')) switcher = JSON.parse(sessionStorage.getItem('switcher'));
if(sessionStorage.getItem('catalogData')) catalogData = JSON.parse(sessionStorage.getItem('catalogData'));
if(sessionStorage.getItem('promocodes')) promocodes = JSON.parse(sessionStorage.getItem('promocodes'));
if($('.goods-page')){
	switcher = false;
	sessionStorage.setItem('switcher', JSON.stringify(switcher));
}
body.style.pointerEvents = 'none';
function sendQuery(url, headers, body){
	return new Promise((resolve, reject)=>{
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: headers
			
		})
		.then(response=>{
			response.ok? resolve(response.json()): reject(response.status);
		});
	});
}
function sendOrderClick(){
	let orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
	if(!$('#one-click-rule').checked) {
		showMessage($('.message5'));
		return;
	}
	if(!isNoEmptyString($('#one-click-number').value)) {
		$('#one-click-number').value = orderInfo['buyer info']['Телефон'];
	}
	send();
	showMessage($('.message6'));
}
function sendOrder(){
	if(!isNoEmpty(cart)&&event.target.closest('.cart-form__btn')) {
			showMessage($('.message4'));
			return;
		}
	if(!$('#rule').checked){
		showMessage($('.message8'));
		return;
	}
	send();
	showMessage($('.message7'));
}

function send(){
	let orderInfo = JSON.parse(sessionStorage.getItem('orderInfo')),
	a = Math.random().toString().replace('0.', '').slice(0,8);
	$('#order-number').textContent = a;
	orderInfo['Номер заказа'] = a;
	sendQuery(urlSend, headers, orderInfo)
	.then(res=>{
		openModal($('.order-modal'), true);
		localStorage.removeItem('cart');
		sessionStorage.clear();
		if($('.cart__table-items'))$('.cart__table-items').innerHTML = '<li class="title_h2">В корзине пусто</li>';
		cartInfo();
		console.log(res)
	});
}

function answer(res){
	$('#show-name').textContent = res.name;
	showMessage($('.message1'));
}
function error(err){console.log(`Произошла ошибка ${err.status}, попробуйте ещё раз.`);}

function sendForm(ev){
	ev.preventDefault();
	let form = $('[name="subscriber_form"]'),
	url = form.action,
	name = trimGaps(form.querySelector('[name="subscriber_name"]').value),
	mail = trimGaps(form.querySelector('[name="subscriber_email"]').value),
	user ={
		name: name,
		mail: mail
	};
	if(!isNoEmptyString(name)||!isNoEmptyString(mail)){
		showMessage($('.message3'));
		return;
	}
	if(form.querySelector('[name="agreement"]').checked){
	sendQuery(urlSend, headers, user).then(answer, error).catch(err=>console.log(err));
	} else showMessage($('.message2'));
}

function getQuery(url, call=null){
	return new Promise((resolve, reject)=>{
		fetch(url).then(response=>{
			response.ok? setTimeout(()=>resolve(response.json()), 2000): reject(response);
		});
	}).then(res=>res, error2).catch(()=>error2());
}
let i = 0;
let a1 =getQuery(urlCatalog),
a2 =getQuery(urlPromo);
function error2(){
	i++;
	if(i>=20) return;
	Promise.all([a1, a2])
	.then(v=>{
		catalogData = v[0];
		promocodes = v[1];
		sessionStorage.setItem('catalogData', JSON.stringify(catalogData));
		sessionStorage.setItem('promocodes', JSON.stringify(promocodes));
		});
}
function slider(ev){
	let counter = 0;
	return function(ev){
		let el = ev.closest('.slider'),
		sItemW = el.querySelector('.slider-item').offsetWidth,
		sContainerW = el.querySelector('.slider-container').offsetWidth,
		sContainerH = el.querySelector('.slider-container').offsetHeight,
		sItemL = el.querySelectorAll('.slider-item').length,
		sTrack = el.querySelector('.slider-track'),
		slides = sContainerW/sItemW,
		sDots = el.querySelectorAll('.slider-dot'),
		sDotL = sDots.length,
		sDotA = el.querySelector('.slider-dot.active');
		let i=0;
		if(ev.matches('.slider-next')) counterPlus();
		if(ev.matches('.slider-prev')) counterMinus();
		function counterPlus(){
			if(Math.round(slides) == 3) i = 1; else if (Math.round(slides) == 4) i = 2;
			if(counter >= sItemL - Math.round(slides)) return;
			counter++;
			if(el.classList.contains('main-block__slider')&&
			window.innerWidth > 991){
				sliderScrollY();
				nextDot();
				return;
			}
			nextDot();
			sliderScroll();
		}
		function counterMinus(){
			if(Math.round(slides) > 2) i = 0;
			if(counter <= 0) return;
			counter--;
			if(el.classList.contains('main-block__slider')&&
			window.innerWidth > 991){
				sliderScrollY();
				prevDot();
				return;
			}
			prevDot();
			sliderScroll();
		}
			function sliderScrollY(){
				let scroll = (sContainerH * counter)/slides;
				sTrack.style.transform = `translateY(-${scroll}px)`;
			}
		function sliderScroll(){
			let scroll = (sContainerW * counter)/slides;
			sTrack.style.transform = `translateX(-${scroll}px)`;
		}
		function indicator(){
			let indicatorDot = i+Math.floor(counter/(sItemL/sDotL));
			setTimeout(()=>{
				sDots.forEach((i)=>i.classList.remove('active'));
				sDots[indicatorDot].classList.add('active');
			}, 800);
		}
		function prevDot(){
			indicator();
			if(sDotA.previousElementSibling != null){
				sDotA.previousElementSibling.classList.add('active');}
		}
		function nextDot(){
			indicator();
			if(sDotA.nextElementSibling != null){
				sDotA.nextElementSibling.classList.add('active');}
		}
	}
}
let sliderOne = slider(),
sliderTwo = slider();

function clickEmulation(target){
 	let click1 = new Event("click", {bubbles: true});
 target.dispatchEvent(click1);
	}
function openBurger(){
	if($('.header__burger-icon').classList.contains('header__burger-icon_active')){
		closeBurger();
		return;
	}
	body.classList.add('lock');
	setTimeout(() => $('.header').classList.add('scroll'), 305);
	$('.header__burger-icon').classList.add('header__burger-icon_active');
	$('.header__row-bottom').classList.add('header__row-bottom_active');
}
function closeBurger(){
		$('.header').classList.remove('scroll');
		body.classList.remove('lock');
		$('.header__burger-icon').classList.remove('header__burger-icon_active');
		setTimeout(() => $('.header__row-bottom').classList.remove('header__row-bottom_active'), 10);
}

function openFilter(){
	body.classList.add('lock');
	$('.filter-catalog__filter').classList.add('active');
}
function closeFilter(){
		body.classList.remove('lock');
		$('.filter-catalog__filter').classList.remove('active');
}

function filterVisualActive(ev){
	ev.closest('.filter').querySelectorAll('.filter-el').
	forEach((i) => i.classList.remove('link_decor'));
	ev.classList.add('link_decor');
}
function closeWindow(){
	$('.manager').classList.remove('manager_active');
}
function openWindow(ev){
	let el = ev.closest('.manager');
	if(ev.classList.contains('btn_d')) {
		closeWindow();
	} else el.classList.add('manager_active');
}

if($$('.manager').length > 0){
	setTimeout(() => {
		$('.manager').style.left = '5px';
	}, 7000);
}

function openSpoiler(ev){
	let el = ev.closest('.spoiler');
	ev.classList.toggle('arrow_active');
	el.querySelector('.spoiler-el').classList.toggle('spoiler-active');
}

function scrollTop(){
	window.scrollTo({
		top: 0,
		let: 0,
		behavior: "smooth"
	});
}

	function openModal(el, ev) {
		if(!isNoEmpty(cart)&&event.target.closest('.cart-form__btn')) {
			showMessage($('.message4'));
			return;
		}
		zIndex++;
		let element = $(`.${el.dataset.modal}`);
		if(!ev){
			element.style.top = event.clientX + 'px';
		element.style.left = event.clientY + 'px';
		}
		element.style.zIndex = zIndex;
		element.classList.remove('hidden');
		setTimeout(() => {
			element.style.top = '';
			element.style.left = '';
			}, 50)
		setTimeout(() => element.classList.remove('show'), 10)
		let paddingCorrect = window.innerWidth - $('body').clientWidth;
		body.classList.add('lock');
		body.style.paddingRight = paddingCorrect + 'px';
	}
	function closeModal(){
		zIndex--;
		let element = event.target.closest('.modal');
		element.style.zIndex = '';
		setTimeout(() => element.classList.add('hidden'), 305);
		element.classList.add('show');
		body.classList.remove('lock');
		body.style.paddingRight = '';
		}
		
	function addActiveClass(){
		if($$('.add-active input').length > 0){
			$$('.add-active input').forEach((item) =>{
				if(item.checked){
					item.parentElement.classList.add('active');
				} else item.parentElement.classList.remove('active');
			});
			$$('.add-active input').forEach((item) =>{
				if(item.disabled){
					item.parentElement.classList.add('no-active');
				} else item.parentElement.classList.remove('no-active');
			});
		}
	}

function formEdit(el, el2){
	el.querySelectorAll('input').forEach((item)=>{
		if(item.hasAttribute('readonly')) {
			item.removeAttribute('readonly');
			item.style.border = '1px solid darkcyan';
			el2.classList.add('active');
			} else {
			item.setAttribute('readonly', '');
			item.style.border ='';
			el2.classList.remove('active');
		}
	});
	setBuyerInfo();
}

function copyPromo(el){
	el.querySelector('.promocode').select();
	document.execCommand("copy");
	showMessage(el.querySelector('.show__message'));
}

function plusPercent(summ, percent){
	if(percent) {
		return Math.round(summ += (summ/100*percent));
		} else return '';
	}
function minusPercent(summ, percent){
	return Math.round(summ -= (summ/100*percent));
}

function plusNumeral(summ, num){return summ += num;}

function showMessage(message){
	message.classList.add('active');
	setTimeout(()=>message.classList.remove('active'), 3000);
}

function isNoEmpty(obj){
	if(Object.getOwnPropertyNames(obj).length)return true; else return false;
}

function dateComparing(time1, time2){
	let tNow = new Date().getTime(),
	tInfo = new Date(`${time1.month +1} ${time1.day} ${time1.year}`).getTime();
	if(tNow<=tInfo) return true; else return false;
}

function isNoEmptyString(str){
	str = trimGaps(str);
	for(let a in str){
		if(str[a]!=' '&&str[a]!='') return true; else return false;
	}
}

function trimGaps(str){return str = str.trim();}
function showMoreCard(arr, target, reload){
	let pValue = 0,
	counter = 0;
	return function(arr, target, reload){
		if(reload !== undefined) {
			counter = 0;
			pValue = reload;
		}
	if(pValue == 0) target.innerHTML = '';
		counter += 12;
	if(arr.length&&!$('.main-preview')) $('.show-more-cards').classList.remove('hidden');
	if(arr.length <= counter) {
		if(!$('.main-preview'))$('.show-more-cards').classList.add('hidden');
		counter = arr.length;
	}
	renderCards(arr, target, pValue, counter);
	return pValue = counter;
	}
}
let showMoreCard1 = showMoreCard();

function discountArr(catArr, target){
	let arr = [];
	catArr.forEach((item)=>{
		if(item.discount&&item.quantity) arr.push(item);
	});
	buferArr = arr;
	showMoreCard1(arr, target);
}


function chosenArrays(srcArr, catArr, target){
	if(srcArr.length == 0) return;
	let arr = [];
	srcArr.forEach((item)=>{
		catArr.forEach((item2)=>{
			if(item2.id == item) arr.push(item2);
		});
	});
	buferArr = arr;
	showMoreCard1(arr, target);
}

function quantityFilter(arr){
	let arrBufer =[];
	arr.forEach((item)=>{
		if(item.quantity!=0) arrBufer.push(item);
	});
	return arrBufer;
}

function priceFilter(arr){
	let from = +$('[name="from"]').value,
	to = +$('[name="to"]').value,
	arrBufer =[];
	if(to == 0) to = Infinity;
	arr.forEach(item=>{
		if(from<=item.price&&item.price<=to) arrBufer.push(item);
	});
	return arrBufer;
}

function sortFilter(arr){
	$$('[name="filter"]').forEach((item)=>{
		if(item.checked){
			switch(item.value){
			case 'row': return;
			case 'alfa':
				arr.sort((a,b)=> a.name > b.name ? 1: -1);
				break;
			case 'alfa-reverse':
				arr.sort((a,b)=> a.name < b.name ? 1: -1);
				break;
			case 'cheap':
				arr.sort((a,b)=>a.price - b.price);
				break;
			case 'expansive':
				arr.sort((a,b)=>b.price - a.price);
				break;
			}
		}
	});
	return arr;
}

function mainPreviev(arr, target, reload){
	let arrBufer;
	arr = quantityFilter(arr);
	$$('[name="filter"]').forEach(item=>{
		if(item.checked){
			switch(item.value){
			case "top":
				arr = arrFilter(arr, "top", true);
				break;
			case "added date":
				arr = arrFilter(arr, "added date");
				break;
			case "action":
				arr = arrFilter(arr, "action", true);
				break;
			}
		}
	})
	showMoreCard1(arr, target, reload);
	clickEmulation($('.about__slider-btn_prev'));
}

function arrFilter(arr, i, k){
	let arrBufer = [];
	arr.forEach(item=>{
		if(dateComparing(item[i])){
			arrBufer.push(item);
			return;
		}
		if(item[i] == k) arrBufer.push(item);
	});
	return arrBufer;
}
function searchForm(ev){
	search = ev.closest('.header__search').querySelector('[name="search_querty"]').value;
	if(!trimGaps(search)) return;
	searchWriting(search);
	location.href = 'catalog.html';
}
function routingFn(ev, el){
	ev.preventDefault();
	searchWriting(el.closest('a').dataset.way);
	location.href = el.closest('a').href;
}
function searchWriting(search){
	search = trimGaps(search);
	switcher = true;
	sessionStorage.setItem('search', search);
	sessionStorage.setItem('switcher', JSON.stringify(switcher));
}


function catalogFilter(arr, target, reload){
	if(switcher) arr = catalogSearch(arr, search);
	if($('#have').checked) arr = quantityFilter(arr);
	arr = priceFilter(arr);
	arr = sortFilter(arr);
	buferArr = arr;
	showMoreCard1(arr, target, reload);
}

function catalogSearch(arr, str){
	let arrBufer = [];
	$('.catalog__way-target').textContent = search;
	$('.catalog__title1 span').textContent = search.toLowerCase();
	str = str.toLowerCase();
	arr.forEach(item=>{
		if(item.name.toLowerCase().includes(str, 0)) {
			arrBufer.push(item);
			return;
		}
		else if(item.type.toLowerCase().includes(str, 0)) {
			arrBufer.push(item);
			return;
		}
		else if(item.brand.toLowerCase().includes(str, 0)) arrBufer.push(item);
	});
	switcher = false;
	sessionStorage.setItem('switcher', JSON.stringify(switcher));
	return arrBufer;
}
function addToCart(el, ev){
	function cartPlus(){
		if(+gCounter.innerHTML >= gHave) {
			showMessage(message);
			return;
		}
		gCounter.innerHTML++;
		plusCartArr(el.id, gCounter.innerHTML, catalogData);
	}
	function cartMinus(){
		if(+gCounter.innerHTML <= 0) return;
		gCounter.innerHTML--;
		minusCartArr(el.id, gCounter.innerHTML);
	}
	function removeFromCart(){
		gCounter.innerHTML = 0;
		minusCartArr(el.id, gCounter.innerHTML);
	}
	function addChosen(){
		let chosen = el.querySelector('.card-goods__chosen');
		if(chosen.matches('.active')){
			removeFromChosenArr(el);
			chosen.classList.remove('active');
		} else {
			addToChosenArr(el);
			chosen.classList.add('active');
		}
	}
	let gCounter = el.querySelector('.goods-count'),
	message = el.querySelector('.card-goods__message'),
	bCart = el.querySelector('.goods-card-del'),
	gHave = +el.querySelector('.card-goods__have').innerHTML;
	if(ev.closest('.goods-minus')) cartMinus();
	if(ev.closest('.goods-plus')) cartPlus();
	if(ev.closest('.goods-card-del')) removeFromCart();
	if(ev.closest('.card-goods__chosen')) addChosen(chosen);
	if($('.goods-page')||$('.card-goods')){
		let fBlock = el.querySelector('.card-goods__flags');
		if(+gCounter.innerHTML > 0){
		fBlock.classList.add('hidden');
		bCart.classList.remove('hidden');
		} else {
			fBlock.classList.remove('hidden');
			bCart.classList.add('hidden');
		}
	}
	if($('.card-goods')){
	let addBtn = el.querySelector('.card-goods__add'),
	qBlock = el.querySelector('.card-goods__quantity');
	if(+gCounter.innerHTML > 0){
		addBtn.classList.add('hidden');
		qBlock.classList.remove('hidden');
	} else {
		addBtn.classList.remove('hidden');
		qBlock.classList.add('hidden');
	}}
}
function setBuyerInfo(){
	let test = true,
	test2 = true,
	test3 = true;
	b: for(let item of $('.person-form').querySelectorAll('input')){
		if(item.required&&item.value == ''){
			showMessage($('.message3'));
			showMessage(item);
			test = false;
			break b;
		}
		if(item.required&&isNoEmpty(buyerInfo)
			&&item.name in buyerInfo
			&&item.value!=buyerInfo[item.name]&&test3){
			test2 = confirm('Обязательные данные получателя изменились, обновить данные в личном кабинете?');
			test3 = false;
		}
		if(test2)buyerInfo[item.name] = item.value;
	}
	localStorage.setItem('buyerInfo', JSON.stringify(buyerInfo));
	return test;
}
if($('.cart-form__post')) {
	setPostInputs(order["type delivery"], order["type payment"]);
	formationOrder2();
}
function setPostInputs(arg1, arg2){
	$('.cart-form__post').querySelectorAll('input').forEach((item)=>{
		if(item.value == arg1||item.value == arg2) item.setAttribute('checked', '');
	});
}
if($('.person-form')) {
	setInputsInfo(buyerInfo);
	formationOrder1();
}
function setInputsInfo(info){
	if(!isNoEmpty(info)) return;
	$('.person-form').querySelectorAll('input').forEach((item)=>{
		for(let key in info){
			if(item.name == key) item.value = info[key];
		}
	});
}

function formationOrder1(){
	let buyer = {};
	$('.person-form').querySelectorAll('input').forEach((item)=>{
		buyer[item.name] = item.value;
	});
	order["buyer info"] = buyer;
	sessionStorage.setItem('orderInfo', JSON.stringify(order));
}

function formationOrder2(){
	$('.cart-form__post').querySelectorAll('input').forEach((item)=>{
		if(item.checked) order[item.name] = item.value;
	});
	sessionStorage.setItem('orderInfo', JSON.stringify(order));
}

function formationOrder3(cart, summ, total, discount){
	order["total quantity"] = total;
	order["common discount"] = discount;
	order["total summ"] = summ;
	for(let key in cart){
		order["goods"][key]= {
			"name": cart[key].arr.name,
			"quantity": cart[key].quantity,
			"price": cart[key].arr.price
		}
	}
	sessionStorage.setItem('orderInfo', JSON.stringify(order));
}

function formationOrder4(el){
	let orderSumm = order["total summ"],
	bufer = orderSumm;
	return function (el){
		let a = $('#total-price'),
		b = $('#ad-service'),
		c = +el.dataset.service,
		summ = +a.textContent,
		serv = +b.textContent,
		percent =0;
		if(c < 100) {
			percent = plusPercent(bufer, c);
			percent -= bufer;
			b.textContent = plusNumeral(serv, percent);
			summ = plusNumeral(summ, percent);
		} else {
			b.textContent = plusNumeral(serv, c);
			summ = plusNumeral(summ, c);
		}
		showMessage(el.querySelector('.message3'));
		el.classList.add('disabled');
		$('#total-price').textContent = summ;
		hCardP.textContent = summ;
		order["services"].push(el.closest('.service').querySelector('.service__title').textContent);
		order["total summ"] = summ;
	}
}
const formationOrderService = formationOrder4();

async function cartInfo(){
	let cart = JSON.parse(localStorage.getItem('cart')),
	el = $('#cart-count'),
	summFinal = 0,
	total = 0,
	summ = 0;
	$$('.cart-item__total-price').forEach((item)=>item.textContent = 0);
	for(let key in cart){
		total += cart[key].quantity
		let tempSumm = summ;
		summ = cart[key].quantity * cart[key].arr.price;
		if($('.cart-item__total-price'))$(`#${key}`).querySelector('.cart-item__total-price').textContent = summ;
		summ += tempSumm;
	}
	if(total == 0) el.classList.add('hidden'); else el.classList.remove('hidden');
	summFinal = await getDiscount(promocodes, summ);
	if($('.cart-form__price')){
		formationOrder3(cart, summFinal, total, summ - summFinal);
		$('#q-goods').textContent = total;
		$('#total-discount').textContent = summ - summFinal;
		$('#total-price').textContent = summFinal;
	}
	el.textContent = total;
	hCardP.textContent = summFinal;
}

function getDiscount(arrPr, summ){
	return new Promise((resolve, reject)=>{
		if($('.cart-form__price')){
			let promo = $('[name="promocode"]');
			localStorage.setItem('promoValue', promo.value);
		}
		let code = localStorage.getItem('promoValue');
		arrPr.forEach((item)=>{
		if(item.value == code&&item.limit <= summ){
			if($('#discount')) $('#discount').textContent = item.discount;
			summ = minusPercent(summ, item.discount);
			resolve({summ: summ, code: code});
		}
	});
		reject({summ: summ, code: code});
	})
	.then((obj)=>{
		if($('.cart-form__price')&&obj.code !='') showMessage($('.message2'));
		return obj.summ;}, (obj)=>{
		if($('.cart-form__price')&&obj.code !='') showMessage($('.message1'));
		return obj.summ;});
}

function markCard(cart, chosen, el){
	for(let key in cart){
		if(el.id == key) {
			el.querySelector('.goods-count').textContent = cart[key].quantity;
			el.querySelector('.card-goods__flags').classList.add('hidden');
			el.querySelector('.card-goods__checked').classList.remove('hidden');
			if(el.querySelector('.card-goods__quantity'))el.querySelector('.card-goods__quantity').classList.remove('hidden');
			if(el.querySelector('.card-goods__add'))el.querySelector('.card-goods__add').classList.add('hidden');
		}
	}
	chosen.forEach((item)=>{
		if(item == el.id) {
		el.querySelector('.card-goods__chosen').classList.add('active');
		}});
}

function plusCartArr(id, count, arr){
	arr.forEach((item)=>{if(item.id == id) cart[id]={arr: item, quantity: +count}});
	localStorage.setItem('cart', JSON.stringify(cart))
	cartInfo();
}
function minusCartArr(id, count){
	if(+count == 0){delete cart[id]} else cart[id].quantity = +count;
	localStorage.setItem('cart', JSON.stringify(cart))
	cartInfo();
}

function addToChosenArr(el){
	chosen.push(el.id);
	localStorage.setItem('chosen', JSON.stringify(chosen));
	chosenCount();
}
function removeFromChosenArr(el){
	chosen.splice(chosen.indexOf(el.id), 1);
	localStorage.setItem('chosen', JSON.stringify(chosen));
	chosenCount();
}

function chosenCount(){
	let el = $('#chosen-count');
	if(chosen.length == 0) {el.classList.add('hidden');
} else el.classList.remove('hidden');
	el.innerHTML = chosen.length;
}

function orderForm(ev){
	ev.preventDefault();
	let test = setBuyerInfo(),
	test2 = isNoEmpty(cart);
	if(!test2) {
		showMessage($('.message4'));
		return;
	}
	if(test&&test2) {
		formationOrder1();
		formationOrder1();
		location.href = 'cart-services.html';
	}
}
$('[name="search_querty"]').addEventListener("focus", ()=>{
	window.removeEventListener("resize", chooseOptionResize);
});
$('[name="search_querty"]').addEventListener("blur", ()=>{
	window.addEventListener("resize", chooseOptionResize);
});
body.addEventListener('keyup', function(){
	if(event.target.closest('[name="search_querty"]')&&
		event.code =='Enter') searchForm(event.target);
});
body.addEventListener("click", chooseOptionClick);
body.addEventListener("change", chooseOptionChange);
window.addEventListener("resize", chooseOptionResize);
function chooseOptionClick(){
	if(event.target.closest('.header__burger')) openBurger();
	if(event.target.matches('.filter-el')) filterVisualActive(event.target);
	if(event.target.closest('.manager')) openWindow(event.target);
	if(event.target.closest('.spoiler-btn')) openSpoiler(event.target.closest('.spoiler-btn'));
	if(event.target.closest('.scroll-top')) scrollTop();
	if(event.target.closest('.modal-open')) openModal(event.target.closest('.modal-open'));
	if(event.target.classList.contains('modal-close')||
		event.target.classList.contains('modal')) closeModal();
	if(event.target.closest('.add-active')) addActiveClass(event.target);
	if(event.target.closest('.filter-catalog__filter-open')) openFilter();
	if(event.target.closest('.filter-catalog__filter-close')||
		event.target.classList.contains('filter-catalog__filter')) closeFilter();
	if(event.target.closest('.main-block__slider-btn')) sliderOne(event.target);
	if(event.target.closest('.about__slider-btn')) sliderTwo(event.target);
	if(event.target.closest('.goods-card')) addToCart(event.target.closest('.goods-card'), event.target);
	if(event.target.closest('.article__button')) copyPromo(event.target.closest('.article__button'));
	if(event.target.closest('.cart-promo-btn')) cartInfo();
	if(event.target.closest('.order-form')) orderForm(event);
	if(event.target.closest('.cart-form__radio')) formationOrder2();
	if(event.target.closest('.service__btn')) formationOrderService(event.target.closest('.service__btn'));
	if(event.target.closest('.person-form__btn')) formEdit(event.target.closest('.person-form'), event.target.closest('.person-form__btn'));
	if(event.target.closest('.show-more-cards')) showMoreCard1(buferArr, targetBlock);
	if(event.target.closest('.send-message')) sendForm(event);
	if(event.target.closest('.header__search-btn')) searchForm(event.target);
	if(event.target.closest('.main-catalog__catalog-link')||
		event.target.closest('.routing')) routingFn(event, event.target);
	if(event.target.closest('.goods__slider-item')) sliderGoods(event.target.closest('.goods__slider-item'), $('.goods__main-img img'), $$('.goods__slider-item'));
	if(event.target.closest('.slider-tattoo__item')) sliderGoods(event.target.closest('.slider-tattoo__item'), $('.slider-tattoo__img img'), $$('.slider-tattoo__item'));
	if(event.target.closest('.send-order-click')) sendOrderClick(event);
	if(event.target.closest('.send-order')) sendOrder(event);
}

chooseOptionResize();
function chooseOptionResize(){
	let iWidth = window.innerWidth;
	menuElementsReplace(iWidth);
	if($$('.filter-catalog__filter').length > 0&&
		iWidth > 991) closeFilter();
	if(iWidth > 991) closeBurger();
	if($$('.manager').length > 0&&
		iWidth > 991) closeWindow();
	if($$('.goods').length > 0&&
		iWidth > 767) goodsElementReplace(iWidth);
	if(window.innerWidth < 1050
		&&window.innerWidth >930
		&& $('.main-block__slider-btn_prev')) clickEmulation($('.main-block__slider-btn_prev'));
}
function menuElementsReplace(iWidth){
	const room = $('.header__room'),
	contacts = $('.header__contacts'),
	burger = $('.header__burger');
	if(767 < iWidth && iWidth < 991) {
		$('.header__cart').append(room);
		burger.after(form);
		$('.header__line').after(contacts);
	} else if(767 > iWidth) {
		$('.header__line').after(contacts);
		$('.header__nav-list').after(form);
		$('.header__nav-list').after(room);
	} else if( iWidth > 991){
		$('.header__catalog').after(form);
		$('.header__row-top').prepend(contacts);
		$('.header__cart').append(room);
	}
}
function goodsElementReplace(iWidth){
	const title = $('.replace-title'),
	price = $('.goods__main-price'),
	btn = $('.goods__main-btn'),
	dl = $('.goods__main-dl'),
	dd = $('.goods__main-dd');
	if(iWidth > 991){
		dl.prepend(price);
		dl.prepend(title);
		dd.after(btn);
	} else{
		$('.goods').prepend(title);
		dd.before(btn);
		$('.goods__main-manage').prepend(price);
	}
}

function chooseOptionChange(){
	if(event.target.closest('.filter-catalog__filter')) catalogFilter(catalogData, targetBlock, 0);
	if(event.target.closest('.main-preview__filter-el')) mainPreviev(catalogData, targetBlock, 0);
	if(event.target.closest('[name="search_querty"]')) searchForm(event.target);
}
function renderCards(cardsArr, target, i, tValue){
	for(; i < tValue; i++){
		renderCardsHtml(cardsArr[i], target);
		insertFlag(cardsArr[i], i);
		markCard(cart, chosen, $$('.card-goods')[i]);
		}
	}

function renderCardsHtml(card, target){
	let slider;
	if($('.main-preview')) slider = 'slider-item';
	target.insertAdjacentHTML(
	'beforeend',
	`<div class="main-preview__catalog-item ${slider}">
	<article class="card-goods goods-card" id="${card['id']}">
		<button type="button" title="Убрать из корзины" class="card-goods__checked goods-card-del hidden"></button>
		<div class="card-goods__flags"></div>
		<button type="button" class="card-goods__chosen" title="Избранные"></button>
		<a href="goods-page.html" class="card-goods__img routing" data-way="${card['id']}">
			<img src="data/${card['id']}/${card['preview']}" alt="${card['type']}" title="${card['type']}">
		</a>
		<h5 class="card-goods__title text_h1">
		<a href="goods-page.html" class="routing" data-way="${card['id']}" title="${card['name']}">${card['name']}</a></h5>
		<div class="card-goods__price">
			<span class="card-goods__price-this title_h12"><span>${card['price']}</span> ₽</span>
			<span class="card-goods__price-old text_h1">${plusPercent(card['price'], card['discount'])}</span>
			<div class="card-goods__message">Большего колличества нет в наличии</div>
		</div>
		<div class="card-goods__option cart-option">
			<div class="card-goods__add goods-card-btn">
				<button class="btn_3 add-to-cart goods-plus"><span class="on">Добавить в корзину</span><span class="off">В корзину</span></button>
			</div>
			<div class="card-goods__quantity text_h1 hidden">
				<button type="button" class="card-goods__quantity-btn btn_m goods-minus"></button>
				<div class="card-goods__quantity-output">
					<b><output class="goods-count">0</output> шт.</b>
					<span>В корзине</span>
					<div class="card-goods__have hidden">${card['quantity']}</div>
				</div>
				<button type="button" class="card-goods__quantity-btn btn_p goods-plus"></button>
			</div>
		</div>
	</article>
	</div>`);
}

function insertFlag(arr, index=0){
	if(arr['quantity'] == 0){
			insertFlag2('<div class="card-goods__flag flag flag_e">Нет на складе</div>');
			return;
			}
		if(dateComparing(arr['added date'])) insertFlag2('<div class="card-goods__flag flag_n">Новинка</div>');
		if(arr['top']) insertFlag2('<div class="card-goods__flag flag flag_h">Хит продаж</div>');
		if(arr['action']) insertFlag2('<div class="card-goods__flag flag flag_p">Акция</div>');
		if(arr['discount']) insertFlag2('<div class="card-goods__flag flag_d">Скидка</div>');
		function insertFlag2(html){
		$$('.card-goods__flags')[index].insertAdjacentHTML(
			'beforeend',
			html);
		}
	}

function renderCart(cart){
	$('.cart__table-items').innerHTML='';
	for(let key in cart){
		$('.cart__table-items').insertAdjacentHTML(
		'beforeend',
		`<li class="goods-card" id='${cart[key]['arr'].id}'>
			<ul class="cart-item text_h1">
				<li>
					<a href="goods-page.html" data-way="${cart[key]['arr'].id}" title="${cart[key]['arr'].name}" class="cart-item__item routing">
						<span class="cart-item__img"><img src="data/${cart[key]['arr'].id}/${cart[key]['arr'].preview}" alt="${cart[key]['arr'].type}"></span>
					<span class="cart-item__flex">
						<span class="cart-item__name">${cart[key]['arr'].name}</span>
						<span class="cart-item__price"><span>Цена: </span>${cart[key]['arr'].price}₽</span>
					</span>
					</a>
				</li>
				<li class="cart-item__quantity quantity">
					<div class="card-goods__message">Большего колличества нет в наличии</div>
					<button class="btn_m goods-minus" type="button"></button>
					<output class="cart-item__output goods-count">${cart[key]['quantity']}</output>
					<button class="btn_p goods-plus" type="button"></button>
					<div class="card-goods__have hidden">${cart[key]['arr'].quantity}</div>
				</li>
				<li class="cart-item__total"><div class="cart-item__total-output"><span>Стоимость: </span><output class="cart-item__total-price">0</output>₽</div></li>
				<li class="cart-item__del"><button class="btn_d goods-card-del" type="button"></button></li>
				<li class="line_b"></li>
			</ul>
		</li>
		`);
	}
}

function renderPromocodes(arr){
	arr.forEach((item)=>{
		$('.promo__block-offers').insertAdjacentHTML(
			'beforeend',
			`<article class="promo__article article">
						<div class="article__img"><img src="${item["pic"]}" alt="${item["name"]}"></div>
						<h3 class="article__title title_h4">${item["name"]}</h3>
						<div class="article__text text_h2">${item["description"]}</div>
						<div class="article__button">
							<div class="show__message">Промокод скопирован</div>
							<input class="promocode" type="text" value="${item["value"]}">
							<button class="article__btn btn_2" type="button"><span>Скопировать промокод</span></button>
						</div>
					</article>`);
	});
}
if(catalogData&&promocodes){
	Promise.all([a1, a2])
	.then(v=>{
		catalogData = v[0];
		promocodes = v[1];
		sessionStorage.setItem('catalogData', JSON.stringify(catalogData));
		sessionStorage.setItem('promocodes', JSON.stringify(promocodes));
		});
	startFn();
} else{
	Promise.all([a1, a2])
	.then(v=>{
		catalogData = v[0];
		promocodes = v[1];
		sessionStorage.setItem('catalogData', JSON.stringify(catalogData));
		sessionStorage.setItem('promocodes', JSON.stringify(promocodes));
		startFn();
	});
}
function startFn(){
	if($('.main-preview__catalog-track')){
		targetBlock = $('.main-preview__catalog-track');
		mainPreviev(catalogData, targetBlock);
	}
	if($('.catalog__discount')) {
		targetBlock = $('.catalog__discount');
		discountArr(catalogData, targetBlock);
	}
	if($('.chousen__block')){
		targetBlock = $('.chousen__block');
		chosenArrays(chosen, catalogData, targetBlock);
	}
	if($('.catalog__catalog-catalog')){
		targetBlock = $('.catalog__catalog-catalog');
		catalogFilter(catalogData, targetBlock);
	}
	chosenCount();
	if($('.promo__block-offers')) renderPromocodes(promocodes);
	if($('.cart__table-items')&&isNoEmpty(cart)) renderCart(cart);
	cartInfo();
	addActiveClass();
	body.style.pointerEvents = '';
}