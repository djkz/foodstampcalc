
// edit corresponding numbers inside the function

// returns standard deductions based on the number of people in the household
function standard_deductions(num_people){
	switch (num_people){
		case 1:
		case 2:
		case 3: 	// this number is for 1 to 3 people
			return 147;
		case 4:	// for 4 people
			return 155;
		case 5:	// for 5 people
			return 181;
		default:	// for any other case (more then 5 people)
			return 208;
	}
	return 0;	
}

// returns excess shelter costs based on the option specified
// avaliable options are "none","telephone","partial" and "full"
function excess_shelter_costs(option){
	console.log("Excess shelter cost for "+option);
	switch(option){
		case "none":
			return 0;
		case "telephone":	//  Telephone Only (no heating, cooling or other)
			return 28;
		case "partial":			// Partial Utility Allowance (no heating/cooling costs)
			return 207;
		case "full":				// Full Utility Allowance
			return 289;
	}
	return 0;
}

// maximum excess shelter cost wont go over this number 
var MAX_SHELTER_COST = 458;

// minumum food stamp amount, if amount calculated is lower then this number, it will get rounded up to this
var MIN_AMOUNT = 16;

// elderly/disabled mimimum medical deduction
var MIN_MEDICAL = 35;


// Maximum allowed income to qualify for food stamps - column C in the table
function maximum_allowed_income(num_people){
	switch(num_people){
			case 1:
				return 1180;
			case 2:
				return 1594;
			case 3:
				return 2008;
			case 4:
				return 2422;
			case 5:
				return 2836;
			case 6:
				return 3249;
			case 7:
				return 3663;
			case 8:
				return 4077;
			case 9:
				return 4491;
			case 10:
				return 4905;
			case 11:
				return 5642;
			case 12:
				return 6048;
			case 13:
				return 6454;
			case 14:
				return 6860;
			case 15:
				return 7266;
			case 16:
				return 7672;
			case 17:
				return 8078;
			case 18:
				return 8484;
			case 19:
				return 8890;
			case 20:
				return 9296;
			default:	// for over 20 people add 414 for each person
				return (num_people - 20) * 414 + 9296;
	}
	return 0;
}

// Maximum net income based on the number of people - column D in the table
function maximum_net_income(num_people){
	switch(num_people){
		case 1:
			return 908;
		case 2:
			return 1226;
		case 3:
			return 1545;
		case 4:
			return 1863;
		case 5:
			return 2181;
		case 6:
			return 2500;
		case 7:
			return 2818;
		case 8:
			return 3136;
		case 9:
			return 3455;
		case 10:
			return 3774;
		case 11:
			return 4340;
		case 12:
			return 4652;
		case 13:
			return 4964;
		case 14:
			return 5276;
		case 15:
			return 5588;
		case 16:
			return 5900;
		case 17:
			return 6212;
		case 18:
			return 6524;
		case 19:
			return 6836;
		case 20:
			return 7148;
		default:	// for over 20 people add 319 for each person
			return (num_people - 20) * 319 +7148;
	}
	return 0;
}

// Maximum monthly allotment the number of people - column E in the table
function maximum_allotment(num_people){
	switch(num_people){
		case 1:
			return 200;
		case 2:
			return 367;
		case 3:
			return 526;
		case 4:
			return 668;
		case 5:
			return 793;
		case 6:
			return 952;
		case 7:
			return 1052;
		case 8:
			return 1202;
		case 9:
			return 1352;
		case 10:
			return 1502;
		case 11:
			return 1652;
		case 12:
			return 1802;
		case 13:
			return 1952;
		case 14:
			return 2102;
		case 15:
			return 2252;
		case 16:
			return 2402;
		case 17:
			return 2552;
		case 18:
			return 2702;
		case 19:
			return 2852;
		case 20:
			return 3002;
		default:	// for over 20 people add 150 for each person
			return (num_people - 20) * 150 +3002;
	}
	return 0;
}



// rest of the code

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
		
		// maximum allowed income doesn't apply to disabled and elderly
		if (!elderly){
			if (total_income >= maximum_allowed_income(people) )
			{
				$('#noqualify').show("scale", 200);
				$('#overlay').show("fade", 100);
				return false;
			}
		}
		var net_earned_income = eincome * 0.80;
		var adjusted_gross_income = net_earned_income + ueincome;

		var childcare =  $("#childcare").val()*1;
		var childsupport = $("#childsupport").val()*1;
		
		var medical = 0;
		// for elderly
		if (elderly){
			medical = $("#medical").val()*1 - MIN_MEDICAL;
			if (medical < 0 ) medical = 0;
		}
		
		var net_income_before_housing = adjusted_gross_income - standard_deductions(people) - childcare - childsupport - medical;
		
		var rent = $("#rent").val()*1;
		var shelter_cost = rent + excess_shelter_costs($("#utilities").val());
		
		var excess_shelter_cost = shelter_cost - net_income_before_housing/2.0 ;
		if (excess_shelter_cost < 0) excess_shelter_cost = 0;
		if (excess_shelter_cost > MAX_SHELTER_COST) excess_shelter_cost = MAX_SHELTER_COST;
		
		var net_income_after_housing = net_income_before_housing - excess_shelter_cost;
		
		if (net_income_after_housing >= maximum_net_income(people))
		{
			$('#toohigh').show("scale", 200);
			$('#overlay').show("fade", 100);
			return false;
		}
		
		

		var net_income_after_housing_03 = Math.ceil( net_income_after_housing * 0.3);
		if (net_income_after_housing_03< 0) net_income_after_housing_03 = 0;
		var result = maximum_allotment(people) - net_income_after_housing_03;
		if ( result < MIN_AMOUNT)
			result = MIN_AMOUNT;

		$("#result").html("$"+result+".00");
	});
});
