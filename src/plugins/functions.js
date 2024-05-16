import Swal from "sweetalert2";

export default {
  name: "functions",
  distinctArray(val){
  let desired_output = (val) => {
      let unique_values = [
          ...new Set(val.map((element) => element.division_desc)),
      ];
      return unique_values;
  };
  let array = []
  desired_output(val).forEach((element) => {
    console.log(element);
    array.push({
      division_desc: element
    })
});
  return array
  },
  async alertDialog(
    icon,
    title,
    text,
    cancelBtn = false,
    confirmText,
    cancelColor = "#d33",
    confirmColor = "#1F5680"
  ) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: cancelBtn,
      confirmButtonColor: confirmColor,
      cancelButtonColor: cancelColor,
      confirmButtonText: confirmText,
    });
  },
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
 
  calDay(sysdate, expire) {
    const sDate = new Date(
      sysdate.toString().substring(0, 4),
      sysdate.toString().substring(5, 7) - 1,
      sysdate.toString().substring(8)
    );
    const aDate = new Date(
      expire.toString().substring(0, 4),
      expire.toString().substring(5, 7) - 1,
      expire.toString().substring(8)
    );
    const daysDiff = Math.round((aDate - sDate) / 86400000); // 2022-09-15T03:32:40.984+0000
    return daysDiff;
  },
  timeConverter(UNIX_timestamp) {
    var a = new Date(Number(UNIX_timestamp) * 1000);
    var months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    var year = Number(a.getFullYear()) + 543;
    var month = months[a.getMonth()];
    var date = a.getDate();
    var formatDate = `${year}${month}${date.toString().padStart(2, "0")}`;
    var time = this.getDateFormat(formatDate).long;
    return time;
  },
  getDateFormat(date) {
    let day = "-";
    let month = {
      digit: "-",
      long: "-",
      short: "-",
    };
    let year = "-";
    let long = "-";
    let short = "-";
    let shortThai = "-";
    let format = {
      day,
      month,
      year,
      long,
      short,
      shortThai,
    };
    if (date === 0) {
      return format;
    }
    if (`${date}`.length !== 8) {
      long = date;
      short = date;
      return format;
    }
    day = date % 100;
    if (day === 0) {
      day = "";
    }
    year = Math.floor(date / 10000);
    let m = Math.floor(date / 100) % 100;
    if (m === 0) {
      m = "";
    }
    shortThai = `${day}/${m}/${year}`;
    m = this.getThaiMonth(m);
    month = {
      digit: m.digit,
      long: m.long,
      short: m.short,
    };
    long = `${day} ${m.long} ${year}`;
    short = `${day} ${m.short} ${year}`;

    format = {
      day,
      month,
      year,
      long,
      short,
      shortThai,
    };
    return format;
  },
  getThaiMonth(m) {
    let mShort = "";
    let mLong = "";
    switch (m) {
      case 1:
        mLong = "มกราคม";
        mShort = "ม.ค.";
        break;
      case 2:
        mLong = "กุมภาพันธ์";
        mShort = "ก.พ.";
        break;
      case 3:
        mLong = "มีนาคม";
        mShort = "มี.ค.";
        break;
      case 4:
        mLong = "เมษายน";
        mShort = "เม.ย.";
        break;
      case 5:
        mLong = "พฤษภาคม";
        mShort = "พ.ค.";
        break;
      case 6:
        mLong = "มิถุนายน";
        mShort = "มิ.ย.";
        break;
      case 7:
        mLong = "กรกฎาคม";
        mShort = "ก.ค.";
        break;
      case 8:
        mLong = "สิงหาคม";
        mShort = "ส.ค.";
        break;
      case 9:
        mLong = "กันยายน";
        mShort = "ก.ย.";
        break;
      case 10:
        mLong = "ตุลาคม";
        mShort = "ต.ค.";
        break;
      case 11:
        mLong = "พฤศจิกายน";
        mShort = "พ.ย.";
        break;
      case 12:
        mLong = "ธันวาคม";
        mShort = "ธ.ค.";
        break;
      default:
    }
    return {
      digit: m,
      long: mLong,
      short: mShort,
    };
  },
};
