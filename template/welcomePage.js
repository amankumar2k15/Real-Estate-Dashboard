const welcome =(name , message)=>{
   return `
   <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        integrity="sha384-rREB+UpdWNZP8htQzF9d3XlK1YNSa4p9L3f6ZG6R8hRL1VCQK4bHA5C3H5NQK1T" crossorigin="anonymous">
</head>

<style>
    body {
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        background-color: rgb(88, 84, 84);
        text-decoration: none;
    }

    section {
        margin: 0 auto;
        display: flex;
        height: 100vh;
        align-items: center;
        max-width: 1024px;
        justify-content: center;
    }

    section>.container {
        background-color: white;
        height: inherit;
        width: 50%;
    }

    section>.container>.box {
        height: inherit;
        padding: 0px 30px;
    }

    .box>.top {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .box>.middle {
        height: 80%;
        padding: 10px 6px 0;
    }

    .middle>.text {
        height: inherit;
        padding: 0 40px;
    }

    .middle>.text>.mainHeading {
        font-size: 20px;
        line-height: 30px;
        color: #121A26;
    }

    .middle>.text>.subHeading {
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.2;
        color: black;
        display: flex;
        gap: 20px;
        flex-direction: column;
    }

    .middle>.text>.subHeading>.commonClass {
        line-height: 17px;
    }

    .middle>.text>button {
        display: inline;
        padding: 10px 16px;
        background-color: #3287d3;
        border-radius: 8px;
        outline: none;
        border: none;
        margin-top: 24px;
        cursor: pointer;
    }

    .middle>.text>button>a {
        text-decoration: none;
        color: white;

    }

    .box>.bottom {
        height: 20%;
        color: #9D9D9D;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 13px;
        padding: 0 18px;
    }

    .box>.subButtom {
        height: inherit;
    }

    .box>.subButtom>.linkFont {
        display: inline;
        width: 100%;
        background-color: gray;
    }

    .box>.subButtom>.linkFont>a {
        background-color: gray;
        text-decoration: none;
    }
</style>

<body>
    <section>
        <div class="container">
            <div class="box">
                <div class="middle">
                  
                    <div class="text">
                        <p class="mainHeading">Welcome to Bharat Escrow!</p>
                        <div class="subHeading">
                            <div class="commonClass">
                                Hello ${name},
                            </div>
                            <div class="commonClass">
                                We are excited to welcome ${name} and we are even more excited
                                about what we have planned. You are already on your way to creating beautiful visual
                                products.
                            </div>
                            <div class="commonClass">
                                Whether you're here for your brand, a cause, or just to learn, welcome! If there's
                                anything you need, we'll be here every step of the way.
                            </div>
                            <div class="commonClass">
                            ${message}
                        </div>
                            <div class="commonClass">
                                Thank you,<br /> Bharat Escrow
                            </div>
                        </div>
                        <button>
                            <a href="https://realestate.bharatescrow.com/" target="_blank">
                                Click to Login
                            </a>
                        </button>
                    </div>
                </div>
                <div class="bottom">
                    <div class="subButtom">
                        <div class="linkFont">
                            <a href="https://www.linkedin.com/company/bharat-escrow/" target="_blank"
                                style="color: gray;">
                                <i class="fa-brands fa-2xl fa-linkedin" style="margin-left: 10px;"></i>
                            </a>
                            <i class="fa-brands fa-2xl fa-square-facebook" style="margin-left: 10px;"></i>
                            <i class="fa-brands fa-2xl fa-square-x-twitter" style="margin-left: 10px;"></i>
                        </div>

                        <div class=" bottomText " style="margin-top: 5px;">Copyright © 2024 || Bharat Escrow</div>
                        <div class="bottomText">A better company begins with a personalized employee experience.</div>
                    </div>

                
                </div>
            </div>


        </div>
    </section>

    <script src="https://kit.fontawesome.com/404f36c780.js" crossorigin="anonymous"></script>
</body>

</html>`
}


module.exports = welcome