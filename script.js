let error = document.querySelector('.error');
class Application{
    constructor(){
        this.calculate = new Calculator();
        this.button = document.querySelector('button');
        this.button.addEventListener('click',this.handleButtonClick);
    }
    handleButtonClick = () =>{
        let startSum = +(document.querySelector('#startSum').value);
        let monthlyAdd = +(document.querySelector('#monthlyAdd').value);
        let period = +( document.querySelector('#days').value);
        let currency = document.querySelector('#currencyUser').value;

        let depositData = new Deposit(startSum, monthlyAdd,period,currency);
        this.banksArray = new BankProduct();
        let checkList = this.calculate.calc(depositData,this.banksArray.bankList);
        let canDepositCheck = [];
        let maxResult;
        let finalResult = [];
        let table = document.querySelector('.tableCell');
        table.style.display="table";
        if(errorCheck(startSum,monthlyAdd,period)){
            table.innerHTML = '';
            return ;
        }
        for (let i=0;i<checkList.length;i++){
            if (checkList[i].canDeposit===false && monthlyAdd===0 && checkList[i].currency===currency){
                canDepositCheck.push(checkList[i]);
            }else
            if(checkList[i].canDeposit && monthlyAdd>0 && checkList[i].currency===currency) canDepositCheck.push(checkList[i]);
        }
        canDepositCheck.sort((a, b) => a.result - b.result);
        if(canDepositCheck.length===0) alert("Нет Такого БАНКА!!!");
        else {
            if(canDepositCheck[canDepositCheck.length-1].result===canDepositCheck[canDepositCheck.length-2].result){
                table.innerHTML ='';
                finalResult.push(canDepositCheck[canDepositCheck.length-2],canDepositCheck[canDepositCheck.length-1]);
                table.innerHTML += `<tr>
                    <th>Название Банка</th>
                    <th>Вклад</th>
                    <th>Процент</th>
                    <th>Итоговая сумма</th>
                </tr>`;
            }else {
                table.innerHTML ='';
                finalResult.push(canDepositCheck[canDepositCheck.length-1]);
                table.innerHTML += `<tr>
                    <th>Название Банка</th>
                    <th>Вклад</th>
                    <th>Процент</th>
                    <th>Итоговая сумма</th>
                </tr>`;
            }
            console.log(finalResult);
            for (let i=0;i<finalResult.length;i++){
                table.innerHTML += getCreate(finalResult[i].bankName,finalResult[i].investName,finalResult[i].incomeType,finalResult[i].result);
            }
        }
    }
}
class Calculator{
    calc(data,banks){
        let result;
        let newArray = banks.filter(function (el){
                return el.sumMin <= data.startSum &&
                    (el.sumMax >= data.startSum || el.sumMax === null) &&
                    el.termMin >=data.period&& el.termMax >= data.period;
        });
        for (let i=0;i<newArray.length;i++){
            result = (data.startSum*Math.pow(1+(newArray[i].incomeType/100)/12,data.period)) + data.monthlyAdd*pow(data.period,newArray[i].incomeType);
            newArray[i].result= Math.floor(result);
        }
        function pow(time,annual){//Цикл меняющий ещемесячный взнос в зависимости от количества месяцев
            let power = 0;
            for(let i=time;i>0;i--){
                power += Math.pow(1+(annual/100)/12,i);
            }
            return (power);
        }
        return newArray;
    }
}
class BankProduct{
    constructor(){
        this.bankList = this.copyBankList();
    }
    copyBankList(){
        let bankArray = [];
        for (let i =0;i<banksFromServer.length;i++){
            bankArray.push(banksFromServer[i]);
        }
        return bankArray;
    }
}
class Deposit{
    constructor(startSum,monthlyAdd,period,currencyUser){
        this.startSum = startSum;
        this.monthlyAdd = monthlyAdd;
        this.period = period;
        this.currency = currencyUser;
    }
}

function errorCheck(startSum, monthlyAdd, period) {
    if(startSum<=0){
        return error.innerHTML = `Начальная сумма вклада Должна быть положительным числом!!!!`;

    }else
    if(monthlyAdd<0){
        return error.innerHTML = `Сумма ежемесячного пополнения Должна быть положительным числом!!!!`;
    }else
    if(period<=0 || Number.isInteger(period)===false){
        return error.innerHTML = `Срок Должен быть положительным целым числом!!!!`;
    }
    return error.innerHTML='';
}
function getCreate(bankName, investName, incomeType, result) {

    const startSumPart = '<td>'+bankName+'</td>' ;
    const monthlyAddPart = '<td>'+ investName +'</td>' ;
    const periodPart = '<td>'+ incomeType +'</td>' ;
    const currencyUserPart = '<td>'+ result +'</td>' ;

    let row = `<tr>` + startSumPart + monthlyAddPart + periodPart + currencyUserPart + '</tr>' ;
    return row;
}


