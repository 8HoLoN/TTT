window.addEventListener('load',function(){
	TTT.reset();

	document.getElementById('checkbox').addEventListener('click',function(e){TTT.setIA();},false);
	document.getElementById('button').addEventListener('click',function(e){TTT.reset();},false);

	var matrixCells = document.querySelectorAll(".cell");
	for (var len = matrixCells.length, i = 0; i != len; i++) {
		matrixCells[i].addEventListener('click', (function(l_i){
			return (function(e){
				TTT.process({'cellId':this.firstChild.id});
			});
		}.call(matrixCells[i],i)), false);
		matrixCells[i].addEventListener('touchstart', (function(l_i){//mobile device
			return (function(event){
				var e = event || window.event;
				e.preventDefault && e.preventDefault();
				e.stopPropagation && e.stopPropagation();
				e.cancelBubble = true;
				e.returnValue = false;

				TTT.process({'cellId':this.firstChild.id});
				return false;
			});
		}.call(matrixCells[i],i)), false);
	}

},false);

function TTT(){
	this.turn=0;
	this.endGame=false;
	this.AISet=false;
	this.IAPlayFirst=false;
	this.eIDs=["tl","tm","tr","ml","mm","mr","bl","bm","br"];// the IDs of elements of the matrix
	this.m=new Array();// the 3x3 matrix (0 : void, 1 : cross, -1 : circle)
	this.cP=1;//current player
	this.crossP='';
	this.circleP='';
	this.voidP='';
};
TTT.prototype.reset = function() {

};
TTT.prototype.process = function(l_args) {// l_args.cellId
	l_args=l_args||{};

	this.turn++;

	if(this.turn%2==0){//AI
		this.picture=this.circleP;//'rond.jpg';
		this.cP=-1;
	}else{
		this.picture=this.crossP;//'croix.jpg';
		this.cP=1;
		document.getElementById("checkbox").disabled=1;
	}

	if(this.m[l_args.cellId]==0 && !this.endGame){
		document.getElementById(l_args.cellId).src=this.picture;
		this.m[l_args.cellId]=this.cP;

		this.test_line();

		if((this.turn==9 && !this.IAPlayFirst || this.turn==10 && this.IAPlayFirst ) && !this.endGame){
			this.endGame=true;
			document.getElementById('button').value='It\'s a tie!';
		}

		if(this.cP==1 && this.AISet && !this.endGame){this.IA();}
	}else{this.turn--;}

};
TTT.prototype.test_line = function() {
	if(this.m[this.eIDs[0]]==this.m[this.eIDs[1]] && this.m[this.eIDs[1]]==this.m[this.eIDs[2]] && this.m[this.eIDs[0]]!=0){this.win(this.m[this.eIDs[0]]);}
	if(this.m[this.eIDs[3]]==this.m[this.eIDs[4]] && this.m[this.eIDs[4]]==this.m[this.eIDs[5]] && this.m[this.eIDs[3]]!=0){this.win(this.m[this.eIDs[3]]);}
	if(this.m[this.eIDs[6]]==this.m[this.eIDs[7]] && this.m[this.eIDs[7]]==this.m[this.eIDs[8]] && this.m[this.eIDs[6]]!=0){this.win(this.m[this.eIDs[6]]);}

	if(this.m[this.eIDs[0]]==this.m[this.eIDs[3]] && this.m[this.eIDs[3]]==this.m[this.eIDs[6]] && this.m[this.eIDs[0]]!=0){this.win(this.m[this.eIDs[0]]);}
	if(this.m[this.eIDs[1]]==this.m[this.eIDs[4]] && this.m[this.eIDs[4]]==this.m[this.eIDs[7]] && this.m[this.eIDs[1]]!=0){this.win(this.m[this.eIDs[1]]);}
	if(this.m[this.eIDs[2]]==this.m[this.eIDs[5]] && this.m[this.eIDs[5]]==this.m[this.eIDs[8]] && this.m[this.eIDs[2]]!=0){this.win(this.m[this.eIDs[2]]);}

	if(this.m[this.eIDs[0]]==this.m[this.eIDs[4]] && this.m[this.eIDs[4]]==this.m[this.eIDs[8]] && this.m[this.eIDs[0]]!=0){this.win(this.m[this.eIDs[0]]);}
	if(this.m[this.eIDs[2]]==this.m[this.eIDs[4]] && this.m[this.eIDs[4]]==this.m[this.eIDs[6]] && this.m[this.eIDs[2]]!=0){this.win(this.m[this.eIDs[2]]);}
};
TTT.prototype.win = function(wn) {
	this.endGame=true;
	document.getElementById('button').value=(wn==1?'Crosses':'Circles')+' win! ';
};
TTT.prototype.reset = function() {
	for(var i=0;i<this.eIDs.length;i++){
		document.getElementById(this.eIDs[i]).src=this.voidP;//"void.jpg";
	}
	for(var i=0;i<this.eIDs.length;i++){
		this.m[this.eIDs[i]]=0;//voidP
	}
	document.getElementById('button').value='New Game';
	this.endGame=false;

	if(this.AISet){
		this.turn=Math.round(Math.random());//random 0 ou 1 0:le joueur begin
	}
	else{
		this.turn=0;//players always plays first
	}

	if(this.turn==1){this.IAPlayFirst=true;this.IA();}
	else{this.IAPlayFirst=false;}

	document.getElementById("checkbox").disabled=0;
};
TTT.prototype.setIA = function() {
	this.AISet=document.getElementById("checkbox").checked;
	this.reset();
};
TTT.prototype.IA = function() {
	this.randomAI();
};
TTT.prototype.randomAI = function() {
	var l_available=[];
	for(var i=0;i<this.eIDs.length;i++){
		if(this.m[this.eIDs[i]]==0){//voidP
			l_available.push(i);
		}
	}
	this.process({'cellId':this.eIDs[l_available[Math.floor(Math.random()*l_available.length)]]});
};
var TTT=new TTT();

function clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
		}
		return copy;
}
