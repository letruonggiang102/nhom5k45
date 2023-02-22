const memberUrl = '/member.html';

const linkDom = '.logo';
const largeGearDom = '.large-gear';

const satelliteGearTop    = '.bgleft-gear-top img';
const satelliteGearLeft   = '.bgleft-gear-left img';
const satelliteGearBottom = '.bgleft-gear-bot img';
const satelliteGearRight  = '.bgleft-gear-right img';

const clickAnimationTime = 2000;

// when user mouse over link
$(linkDom).mouseover(e => {
    $(largeGearDom).addClass('when-link-over');
})

// when user mout out link
$(linkDom).mouseout(e => {
    $(largeGearDom).removeClass('when-link-over');
})

$(linkDom).click(e => {

    $(satelliteGearTop).addClass('top-gear-when-link-clicked');

    $(satelliteGearLeft).addClass('left-gear-when-link-clicked');

    $(satelliteGearBottom).addClass('bot-gear-when-link-clicked');

    $(satelliteGearRight).addClass('right-gear-when-link-clicked');

    setTimeout(() => {
        location.href = memberUrl
    }, clickAnimationTime);
})

var delay = 2000,
	value = 0,
	valueStore = 0,
	tick = 1,
	tickStore = 1,
	tickDiff = 0,
	tickDiffValue = 0;
	
// setInterval(() => {
// 	value = Math.ceil(Math.random() * 100);
// 	console.log(value)
// }, 500)

function valBetween(v, min, max) {
	return (Math.min(max, Math.max(min, v)));
}

(function loop() {
	// value = 60
	tick = valBetween(Math.ceil((value / 1024) * 28), 1, 28);
	tickDiff = Math.abs(tick - tickStore);
	tickDiffValue = Math.abs(value - valueStore) / tickDiff;
	console.log("tickDiff: " + tickDiffValue + " * " + tickDiff + " = " + (tickDiffValue * tickDiff));
	var counter = 0,
		valueStoreTemp = valueStore,
		tickStoreTemp = tickStore;
	if (value > valueStore) {
		for (i = tickStoreTemp; i <= tick; i++) {
			(function(i) {
				setTimeout(function() {
					// $('body').css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0) 50%), linear-gradient(' + $('#gauge path:nth-child(' + i + ')')[0].style.fill + ', ' + $('#gauge path:nth-child(' + i + ')')[0].style.fill + ' 50%, #fff 50%)');
					// $('#gauge').css('box-shadow', '0 0 32px rgba(21, 55, 172, 0.25), inset 0 -192px 192px -240px ' + $('#gauge path:nth-child(' + i + ')')[0].style.fill + ', inset 0 0 2px -1px ' + $('#gauge path:nth-child(' + i + ')')[0].style.fill);
					$('#gauge path:nth-child(' + i + ')').show();
					$('#gauge-label')
						.css('color', $('#gauge path:nth-child(' + i + ')')[0].style.fill)
						.text(Math.ceil(valueStoreTemp + (tickDiffValue * Math.abs(tickStoreTemp - i))));
					if (i == tick) { $('#gauge-label').text(value); }
					// console.log(i);
				}, 50 * counter);
				counter++;
			}(i));
		}
	} else if (value < valueStore) {
		for (i = tickStoreTemp; i >= tick; i--) {
			(function(i) {
				setTimeout(function() {
					// $('body').css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.25), rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0) 50%), linear-gradient(' + $('#gauge path:nth-child(' + i + ')')[0].style.fill + ', ' + $('#gauge path:nth-child(' + i + ')')[0].style.fill + ' 50%, #fff 50%)');
					// $('#gauge').css('box-shadow', '0 0 32px rgba(21, 55, 172, 0.25), inset 0 -192px 192px -240px ' + $('#gauge path:nth-child(' + i + ')')[0].style.fill + ', inset 0 0 2px -1px ' + $('#gauge path:nth-child(' + i + ')')[0].style.fill);
					$('#gauge path:nth-child(' + i + ')').hide();
					$('#gauge-label')
						.css('color', $('#gauge path:nth-child(' + i + ')')[0].style.fill)
						.text(Math.floor(valueStoreTemp - (tickDiffValue * Math.abs(tickStoreTemp - i))));
					if (i == tick) { $('#gauge-label').text(value); }
					// console.log(i);
				}, 50 * counter);
				counter++;
			}(i));
		}
	}
	valueStore = value;
	tickStore = tick;
	window.setTimeout(loop, delay);
})();

// for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
//     e.style.setProperty('--value', e.value);
//     e.style.setProperty('--min', e.min == '' ? '0' : e.min);
//     e.style.setProperty('--max', e.max == '' ? '100' : e.max);
//     e.addEventListener('input', () => e.style.setProperty('--value', e.value));
// }

// 	updateColor = (scale, value)
// 	$("styled-slider slider-progress").html("#{value/100}")

// SLIDER BAR NEW

var elem = document.querySelector('input[type="range"]');

var rangeValue = function(){
	var newValue = elem.value;
  	var target = document.querySelector('.value');
  	target.innerHTML = newValue;
}

elem.addEventListener("input", rangeValue);

// xem clip thingspeak
var channel  = 2040447;
var readKey  = 'T5UUCJ0P288JSDUR';
var writeKey = 'GGLCZO0G8O4NIVIR';


var ledFieldId = 1;

// hàm lấy giá trị ppm từ server
function fetchPpm() {
	
	const ppmFieldId = 4
	const url = `https://api.thingspeak.com/channels/${channel}/fields/${ppmFieldId}/last.json?api_key=${readKey}`;
	
	// hàm lấy giá trị ppm từ server
	$.get(url, function(data) {
		
		// giá trị ppm
		var ppm = data[`field${ppmFieldId}`];
		
		// ghi vào biến 'value', chính là biến chứa giá trị của gauge
		value = parseInt(ppm)
		
	})
}

setInterval(fetchPpm, 1000);




// class input của slider
const slider = '.slider';

// hàm bắt sự kiện khi thay đổi giá trị slider
$(slider).change(function(data) {
	
	// giá trị thay đổi
	const sliderValue = data.target.value;
	
	const alarmLevelFieldId = 3;
	const url = `https://api.thingspeak.com/update?api_key=${writeKey}&field${alarmLevelFieldId}=${slider}`;
	
	// hàm gửi dữ liệu lên server
	$.get(url, function(data) {
		if(data == 0) {
			// logic xử lý khi giới hạn 15s thingspeak
			
			// bật thông báo lỗi
			alert('giới hạn 15s');
		}
	})
	
})
