$(document).ready(function() {
	$(".hint").click(function(){
		$(".tipbox").hide();
		$(this).next().show("slide", { direction: "left" }, 200);
	});
	$("body").click(function() {
	      $('.tipbox').fadeOut("fast");
	      $('#overlay').fadeOut("fast");
	});
	
	$(".hint").click(function(event){
	      event.stopPropagation();
	});
	
	$("#calculate").click(function(){
		// number of people in the household
		var people = $("#people").val()*1;
		if ( people < 1){
			$('#toolow').show("scale", 200);
			$('#overlay').show("fade", 100);
			return false;
		}
		// income
		var eincome = $("#eincome").val()*1;
		var ueincome = $("#ueincome").val()*1;
		var total_income = eincome + ueincome;
		
		var net_earned_income = eincome * 0.80;
		var adjusted_gross_income = net_earned_income + ueincome;
		
		var standard_deduction = 0;
		if (people<=3)
			standard_deduction = 142;
		else if (people==4)
			standard_deduction = 153;
		else if (people==5)
			standard_deduction = 179;
		else if ( people>5 )
			standard_deduction = 205;

		var childcare =  $("#childcare").val()*1;
		var childsupport = $("#childsupport").val()*1;
		
		var medical = $("#medical").val()*1-35;
		if (medical < 0 ) medical = 0;
		
		var net_income_before_housing = adjusted_gross_income - standard_deduction - childcare - childsupport - medical;
		
		var rent = $("#rent").val()*1;
		var shelter_cost = rent + $("#utilities").val()*1;
		
		var excess_shelter_cost = shelter_cost - net_income_before_housing/2.0 ;
		if (excess_shelter_cost < 0) excess_shelter_cost = 0;
		//if (excess_shelter_cost > 458) excess_shelter_cost = 458;
		
		var net_income_after_housing = net_income_before_housing - excess_shelter_cost;
		
		var max_net_income = (people - 1)*312 + 903;
		if (net_income_after_housing >= max_net_income)
		{
			$('#noqualify').show("scale", 200);
			$('#overlay').show("fade", 100);
			return false;
		}
		
		var max_foodstamp_allotment = 0;
		if (people == 1)
			max_foodstamp_allotment = 200;
		else if (people == 2)
			max_foodstamp_allotment = 367;
		else if (people == 3)
			max_foodstamp_allotment = 526;
		else if (people == 4)
			max_foodstamp_allotment = 668;
		else if (people == 5)
			max_foodstamp_allotment = 793;			
		else if (people == 6)
			max_foodstamp_allotment = 952;	
		else if (people == 7)
			max_foodstamp_allotment = 1052;			
		else if (people == 8)
			max_foodstamp_allotment = 1202;	
		else if (people > 8)
			max_foodstamp_allotment = (people - 8)*150 + 1202;		

		var net_income_after_housing_03 = Math.ceil( net_income_after_housing * 0.3);
		var result = max_foodstamp_allotment - net_income_after_housing_03;
		if ( result < 15)
			result = 14;

		$("#result").html("$"+result+".00");
	});
});