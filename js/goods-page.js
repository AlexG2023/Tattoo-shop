function sliderGoods(el, mImg, iImgs){
	mImg.src = el.querySelector('img').getAttribute('src');
	iImgs.forEach(item=>item.classList.remove('active'));
	el.classList.add('active');
}
	let urlSearch =`https://raw.githubusercontent.com/AlexG2023/Tattoo-shop/main/data/${search}/tatto000.json`,
	a3 = getQuery(urlSearch);
	Promise.all([a1, a2, a3]).then(res=>{
		renderGoodsPage(res[2]);
		markCard(cart, chosen, $('.goods-card'));
	});
function renderGoodsPage(b){
	let a = arrFilter(catalogData, 'id', search)[0];
	insertFlag(a);
	$('.goods__main-img img').setAttribute('src', `data/${search}/${a.preview}`);
	$('.goods__main-dd').textContent = a.description;
	$('.goods__title').textContent = a.name;
	$('.goods-target').textContent = a.name;
	$('.goods__main-this output').textContent = a.price;
	$('.goods__main-old').textContent = plusPercent(a.price, a.discount);
	$('.card-goods__have').textContent = a.quantity;
	$('.goods__main-block').id = a.id;
	$('.goods-producer').textContent= a.brand;
	$('.goods__main-dd').innerHTML = b.description;
	$('.goods-additional').innerHTML = b.description;
	$('.goods-description').innerHTML = b['additional-des'];
	$('.slider-tattoo__img img').setAttribute('src', `data/${search}/${b.images[0]}`);
	renderSliderImgHtml(b.images);
	renderHaracterHtml(b.character);
	renderImgHtml(b['goods-img']);
}
function renderImgHtml(arr){
	$('.goods__slider-track').innerHTML = '';
	arr.forEach(item=>{
		$('.goods__slider-track').insertAdjacentHTML(
			'beforeend',
			`<div class="goods__slider-item">
			<img src="data/${search}/${item}" alt="goods"></div>`);
	});
}
function renderHaracterHtml(arr){
	$('.goods-caracter').innerHTML = '';
	for(let k in arr){
		$('.goods-caracter').insertAdjacentHTML(
			'beforeend',
			`<li class="goods__description-parametr line_b">
			<span>${k}</span><span>${arr[k]}</span></li>`);
	}
}
function renderSliderImgHtml(arr){
	$('.slider-tattoo__track').innerHTML = '';
	arr.forEach(item=>{
		$('.slider-tattoo__track').insertAdjacentHTML(
			'beforeend',
			`<div class="slider-tattoo__item">
			<img src="data/${search}/${item}" alt="slider-tattoo"></div>`);
	});
}