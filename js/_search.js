(function(){
			function detail(){
				this.goods = document.querySelector('.options .goods');	 //商品头部，包括图片和产品名称价格等
				this.para  = document.querySelector('.options .para');	//商品属性，颜色 尺寸 码数等
				this.index = window.location.search.match(/[\d]+/)[0]; //获取数据索引，指定某件商品
				this.isSingle = false;

				this.loadOptions();
				this.addEventHandler();

				this.cremain = document.querySelector('.option-quantity .piece');//当前商品所剩件数
				this.buyNumber = this.para.querySelector('.option-quantity input[type=number]');//购买数量
				this.price = document.querySelector('.options h3');
			}
			detail.prototype.loadOptions = function(){
				var that = this;
				this.para.innerHTML = '';

							

				//加载产品属性部分
				var queue = [];//装载产品带有的属性，颜色尺寸等
				var regx = new RegExp(/_[\w]+/);//匹配属性正则
				for(var x in searchList[that.index]){if(regx.test(x)){queue.push(x)}};

				//for循环产品属性里面的子元素
				for(var i=0,len=queue.length; i<len;i++){
					//创建显示属性名称的dom标签
					var dl = document.createElement('dl');
					dl.className='option'+queue[i];

					//检测属性是对象或数组
					var type = Object.prototype.toString.call(searchList[that.index][queue[i]]);
					var temp = [];
					var columnSize=0;//检测属性的子元素的字符串长度，根据长度设定布局的class样式，分为几列;
					var frg = document.createDocumentFragment();
					//属性为对象
					if(type.match(/[a-zA-Z]+/g)[1] == 'Object'){				
						for(var x in searchList[that.index][queue[i]]){
							temp.push(x);				
						}
						if(i==0 && temp.length<=1){that.isSingle = true};//主属性的子属性是否只有一个(例如只有一种颜色的衣服)
						columnSize = 5;
						for(var n=0; n<temp.length; n++){
							var dd = document.createElement('dd');
							dd.className = 'col_'+columnSize;
							if(n == 0){
								dd.innerHTML = '<input type="radio" name="'+queue[i]+'" value="'+temp[n]+'" checked><i class="color" style="background-color:#'+temp[n]+'" checked></i>';
							}else{
								dd.innerHTML = '<input type="radio" name="'+queue[i]+'" value="'+temp[n]+'"><i class="color" style="background-color:#'+temp[n]+'"></i>';
							}
							frg.appendChild(dd);
						}
						//console.log(temp)
					//属性为数组
					}else if(type.match(/[a-zA-Z]+/g)[1] == 'Array'){
						var  search_i = searchList[that.index][queue[i]]
						for(var x=0; x<search_i.length; x++){
							temp.push(search_i[x]);
							if(search_i[x].length > columnSize){
								columnSize = search_i[x].length;
								columnSize = columnSize<4?4:columnSize;
							}
						}
						for(var n=0; n<temp.length; n++){
							var dd = document.createElement('dd');
							dd.className = 'col_'+columnSize;
							if(n == 0){
								dd.innerHTML = '<input type="radio" name="'+queue[i]+'" value="'+temp[n]+'" checked><span>'+temp[n]+'</span></i>';
							}else{
								dd.innerHTML = '<input type="radio" name="'+queue[i]+'" value="'+temp[n]+'"><span>'+temp[n]+'</span></i>';
							}
							frg.appendChild(dd);
						}
					}

					//console.log(temp + '|||' + columnSize);

					var dt = document.createElement('dt');
					dt.innerHTML = queue[i]+':<span>'+temp[0]+'</span>';
					var div = document.createElement('div');
					div.className = 'dd';
					div.appendChild(frg);		

					dl.appendChild(dt);
					dl.appendChild(div);
					//console.log(dl);
					this.para.appendChild(dl);
				}

				

				//加载产品头部
				var once = [];
				for(var v in searchList[this.index]['suit']){
					for(z in searchList[this.index]['suit'][v]){
						once.push(z+'|'+searchList[this.index]['suit'][v][z])
					}
					break;
				}
				this.goods.innerHTML = '<div class="img"><img src="'+ searchList[this.index]['img'] +'" alt=""></div><div class="right"><p>'+searchList[this.index]['title']+'</p><h3>US $'+ once[0].split('|')[2] +'</h3></div>';
				for(var q=0,len2=once.length;q<len2;q++){
					if(once[q].split('|')[1] == 0){
						that.para.querySelector('input[value="'+once[q].split('|')[0]+'"]').parentNode.classList.add('disable');
						//console.log(once[q].split('|')[0])
					}
				}

				//加载购买数量
				var quantity = document.createElement('dl');
				quantity.className = 'option-quantity';
				quantity.innerHTML = '<dt>Quantity:<span>1</span></dt><div class="dd"><span class="minus"></span> <input type="number" value="1" name="quantity" max="'+once[0].split('|')[1]+'"> <span class="add"></span> <span class="piece">'+once[0].split('|')[1]+' piece left</span></div>';
				this.para.appendChild(quantity);
			}
			detail.prototype.addEventHandler = function(){
				var that = this;
				var all = that.para.querySelectorAll('input[type=radio]');
				for(var i=0,len=all.length; i<len; i++){
					all[i].onclick = function(e){
						
						var focus = [];//选中的各项属性的input
						var _value =[];
						var _name = [];
						for(var n=0; n<len; n++){if(all[n].checked){
							focus.push(all[n]);
							_value.push(all[n].value);
							_name.push(all[n].name);
						}};
							console.log(_value);
							console.log(_name);
						//产品主属性
						if(this.parentNode.parentNode.parentNode === that.para.firstChild){
							if(that.isSingle)return;
							if(that.para.querySelector('.disable')){
								var disables = that.para.querySelectorAll('.disable');
								for(var o=0,dis_len=disables.length;o<dis_len;o++){
									disables[o].classList.remove('disable');
								}
							};
							
							//主属性的属性和子项值
							var value = this.value;//值,如XXL XL L
							var name = this.name;//属性，颜色，尺寸码数
							var remain = searchList[that.index]['suit'][value];

							document.querySelector('.goods img').src = searchList[that.index][name][value];
							for(var x in remain){
								if(remain[x].split('|')[0] == 0){
									that.para.querySelector('input[value="'+x+'"]').parentNode.classList.add('disable');
									//console.log(that.para.querySelector('input[value="'+x+'"]').parentNode.parentNode.parentNode);
								}
							}
							that.cremain.innerHTML = searchList[that.index]['suit'][value][focus[1].value].split('|')[0] + ' piece remain';
							that.buyNumber.max = searchList[that.index]['suit'][value][focus[1].value].split('|')[0];
							that.price.innerHTML = 'US $'+ searchList[that.index]['suit'][value][focus[1].value].split('|')[1];
							//console.log(focus[1].value)
						}else{
							//console.log(searchList[that.index]['suit'][focus[0].value][this.value].split('|')[0])
							that.cremain.innerHTML = searchList[that.index]['suit'][focus[0].value][this.value].split('|')[0] + ' piece remain';
							that.buyNumber.max = searchList[that.index]['suit'][focus[0].value][this.value].split('|')[0];
						}
					}
				}

				document.querySelector('.img').addEventListener('click',function(e){
					//console.log(this.classList.includes('full'))
					if(e.target.nodeName.toLowerCase() == 'img'){

						if(!this.className.match(/fullscreen/)){
							this.classList.add('fullscreen');
						}						
					}else{
						if(this.className.match(/fullscreen/)){
							this.classList.remove("fullscreen")
						}
					}
				},false)

				document.querySelector('.option-quantity .add').addEventListener('click',function(){
					var input = that.buyNumber;
					var max = that.buyNumber.max*1;
					input.value++;
					if(input.value > max){
						input.value = max;
					}
					document.querySelector('.options .para').querySelector('.option-quantity>dt>span').innerHTML = input.value;
				},false)

				that.para.querySelector('.option-quantity .minus').addEventListener('click',function(){
					var input = that.buyNumber;
					input.value--;
					if(input.value<1){
						input.value = 1;
					}
					that.para.querySelector('.options .para').querySelector('.option-quantity>dt>span').innerHTML = input.value;
				},false)
			}

			new detail();
			
		})()

		{
		'title':'EAST KNITTING Fashion Women New Long Sleeve Pullovers celebrity style winter Zipper knitwear Sweater',
		'newPrice':'150.40-200.14',
		'oldPrice':'180.40-280.16',
		'img':'../images/search_01-1.jpg',		
		'_Color':{'bad3f1':'../images/search_01-1.jpg','ffd200':'../images/search_01-2.jpg','1a1920':'../images/search_01-3.jpg'},
		'_Size':['XXL','XL','L','M','S'],
		'_Capacity':['2G','3G','4G'],
		'remain':768,
		'totalSell':800,
		'freeShipping':true,
		'bargain':false,
		'suit':{
			'bad3f1':{
				'XXL':{'2G':'50|150.40','3G':'80|180.40','4G':'10|200.40'},
				'XL':{'2G':'50|150.40','3G':'80|180.40','4G':'10|200.40'},
				'L':{'2G':'50|150.40','3G':'80|180.40','4G':'10|200.40'},
				'M':{'2G':'50|150.40','3G':'80|180.40','4G':'10|200.40'},
				'S':{'2G':'50|150.40','3G':'80|180.40','4G':'10|200.40'}
			},
		}
	},