function show_result() {
    let eng = document.querySelector("#Eng").value || 0;
    let math = document.querySelector("#Math").value || 0;
    let c = document.querySelector("#C").value || 0;
    let phy = document.querySelector("#Phy").value || 0;

    let tot = parseFloat(eng) + parseFloat(math) + parseFloat(c) + parseFloat(phy);
    let per = (tot * 100) / 400;

    if (per >= 90) {
        document.querySelector(".grd").innerHTML = "A+";
    } else if (per >= 80) {
        document.querySelector(".grd").innerHTML = "A";
    } else if (per >= 70) {
        document.querySelector(".grd").innerHTML = "B";
    } else if (per >= 60) {
        document.querySelector(".grd").innerHTML = "C";
    } else if (per >= 50) {
        document.querySelector(".grd").innerHTML = "D";
    } else if (per >= 40) {
        document.querySelector(".grd").innerHTML = "E";
    } else {
        document.querySelector(".grd").innerHTML = "F";
    }

    document.querySelector(".per").innerHTML = per;
    document.querySelector(".tot").innerHTML = tot;

    if (per >= 40) {
        document.querySelector(".RESULT h2").innerHTML = "You passed";
    } else {
        document.querySelector(".RESULT h2").innerHTML = "You Failed";
    }
}
