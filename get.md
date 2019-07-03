---
layout: page-notitle
title: Get RESTHeart Platform
permalink: /get
---
<div class="jumbotron bg-light mt-4">

<form id="pre-checkout" novalidate class="was-validated">
    <div class="form-row">
        <h2 class="text-info">Get RESTHeart Platform</h2>
    </div>
    <hr class="my-4">
    <div class="form-row">
        <div class="col-md-10">
            <select id="item" class="form-control form-control-lg" required>
                <option value="0">RESTHeart Platform 30 Days Trial</option>
                <option value="1">RESTHeart Platform Professional Edition</option>
            </select>
        </div>
         <div class="col-md-2">
            <input class="text-strong text-center form-control-plaintext form-control-lg text-right" id="price" aria-describedby="price" disabled value="Free">
        </div>
        <div class="col-12 my-0 d-none" id="qtn-tip">
            <div class="hint mt-2 text-muted"><small>Specify quantities during checkout.</small></div>
        </div>
    </div>
    <hr class="my-4">
    <div class="form-row mt-2">
        <h2 class="text-info">Ship to</h2>
    </div>
    <div class="form-row">
        <div class="col-md-6 mb-3">
            <label for="organization">Organization name</label>
            <input type="text" class="form-control form-control-lg" id="organization" required minlength="3">
        </div>
        <div class="col-md-6 mb-3">
            <label for="email">Email</label>
            <div class="input-group">
                <div class="input-group-prepend">
                <span class="input-group-text" id="emailPrepend">@</span>
                </div>
                <input type="email" class="form-control form-control-lg" id="email" aria-describedby="email" required pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$">
            </div>
            <div class="hint mt-2 text-muted text-center">
                <small>We'll send the license key to this email and never share it with anyone else.</small>
            </div>
        </div>
        <div class="invalid-feedback">Invalid email address</div>
    </div>
    <div id="billing" class="d-none">
        <hr class="my-4">
        <div class="form-row mt-2">
            <h2 class="text-info">Billing Address</h2>
        </div>
        <div class="form-row">
            <div class="col-md-6">
                <label for="address">Address</label>
                <textarea type="text" class="form-control form-control-lg" id="address" rows="1" minlength="5"></textarea>
            </div>
            <div class="col-md-3">
                <label for="zip">Zip</label>
                <input type="text" class="form-control form-control-lg" id="zip" minlength="2">
            </div>
            <div class="col-md-3">
                <label for="country">Country</label>
                <select id="country" class="form-control form-control-lg custom-select">
                    <option disabled selected><span class="text-muted"></span></option>
                    <option value="AF">Afghanistan</option>
                    <option value="AL">Albania</option>
                    <option value="DZ">Algeria</option>
                    <option value="AS">American Samoa</option>
                    <option value="AD">Andorra</option>
                    <option value="AO">Angola</option>
                    <option value="AI">Anguilla</option>
                    <option value="AG">Antigua and Barbuda</option>
                    <option value="AR">Argentina</option>
                    <option value="AM">Armenia</option>
                    <option value="AW">Aruba</option>
                    <option value="AU">Australia</option>
                    <option value="AT">Austria</option>
                    <option value="AZ">Azerbaijan</option>
                    <option value="BS">Bahamas</option>
                    <option value="BH">Bahrain</option>
                    <option value="BD">Bangladesh</option>
                    <option value="BB">Barbados</option>
                    <option value="BY">Belarus</option>
                    <option value="BE">Belgium</option>
                    <option value="BZ">Belize</option>
                    <option value="BJ">Benin</option>
                    <option value="BM">Bermuda</option>
                    <option value="BT">Bhutan</option>
                    <option value="BO">Bolivia</option>
                    <option value="BA">Bosnia and Herzegovina</option>
                    <option value="BW">Botswana</option>
                    <option value="BV">Bouvet Island</option>
                    <option value="BR">Brazil</option>
                    <option value="IO">Brit. Indian Ocean</option>
                    <option value="VG">British Virgin Islands</option>
                    <option value="BN">Brunei Darussalam</option>
                    <option value="BG">Bulgaria</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="BI">Burundi</option>
                    <option value="KH">Cambodia</option>
                    <option value="CM">Cameroon</option>
                    <option value="CA">Canada</option>
                    <option value="CV">Cape Verde</option>
                    <option value="KY">Cayman Islands</option>
                    <option value="CF">Central African Republic</option>
                    <option value="TD">Chad</option>
                    <option value="CL">Chile</option>
                    <option value="CN">China</option>
                    <option value="CX">Christmas Island</option>
                    <option value="CC">Cocos Islands</option>
                    <option value="CO">Colombia</option>
                    <option value="KM">Comoros</option>
                    <option value="CG">Congo</option>
                    <option value="CK">Cook Islands</option>
                    <option value="CR">Costa Rica</option>
                    <option value="CI">Cote D’Ivoire</option>
                    <option value="HR">Croatia</option>
                    <option value="CU">Cuba</option>
                    <option value="CW">Cura çao</option>
                    <option value="CY">Cyprus</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="DK">Denmark</option>
                    <option value="DJ">Djibouti</option>
                    <option value="DM">Dominica</option>
                    <option value="DO">Dominican Republic</option>
                    <option value="EC">Ecuador</option>
                    <option value="EG">Egypt</option>
                    <option value="SV">El Salvador</option>
                    <option value="GQ">Equatorial Guinea</option>
                    <option value="ER">Eritrea</option>
                    <option value="EE">Estonia</option>
                    <option value="ET">Ethiopia</option>
                    <option value="FK">Falkland Islands</option>
                    <option value="FO">Faroe Islands</option>
                    <option value="FJ">Fiji</option>
                    <option value="FI">Finland</option>
                    <option value="FR">France</option>
                    <option value="GF">French Guiana</option>
                    <option value="PF">French Polynesia</option>
                    <option value="TF">French Southern Terr.</option>
                    <option value="GA">Gabon</option>
                    <option value="GM">Gambia</option>
                    <option value="GE">Georgia</option>
                    <option value="DE">Germany</option>
                    <option value="GH">Ghana</option>
                    <option value="GI">Gibraltar</option>
                    <option value="GR">Greece</option>
                    <option value="GL">Greenland</option>
                    <option value="GD">Grenada</option>
                    <option value="GP">Guadeloupe</option>
                    <option value="GU">Guam</option>
                    <option value="GT">Guatemala</option>
                    <option value="GG">Guernsey</option>
                    <option value="GN">Guinea</option>
                    <option value="GW">Guinea-Bissau</option>
                    <option value="GY">Guyana</option>
                    <option value="HT">Haiti</option>
                    <option value="HM">Heard/ Mcdonald Islands</option>
                    <option value="VA">Holy See/ Vatican City</option>
                    <option value="HN">Honduras</option>
                    <option value="HK">Hong Kong</option>
                    <option value="HU">Hungary</option>
                    <option value="IS">Iceland</option>
                    <option value="IN">India</option>
                    <option value="ID">Indonesia</option>
                    <option value="IR">Iran</option>
                    <option value="IQ">Iraq</option>
                    <option value="IE">Ireland</option>
                    <option value="IL">Israel</option>
                    <option value="IT">Italy</option>
                    <option value="JM">Jamaica</option>
                    <option value="JP">Japan</option>
                    <option value="JE">Jersey</option>
                    <option value="JO">Jordan</option>
                    <option value="KZ">Kazakhstan</option>
                    <option value="KE">Kenya</option>
                    <option value="KI">Kiribati</option>
                    <option value="KW">Kuwait</option>
                    <option value="KG">Kyrgyzstan</option>
                    <option value="LA">Lao People’s DR</option>
                    <option value="LV">Latvia</option>
                    <option value="LB">Lebanon</option>
                    <option value="LS">Lesotho</option>
                    <option value="LR">Liberia</option>
                    <option value="LY">Libyan Arab Jamahiriya</option>
                    <option value="LI">Liechtenstein</option>
                    <option value="LT">Lithuania</option>
                    <option value="LU">Luxembourg</option>
                    <option value="MO">Macao</option>
                    <option value="MK">Macedonia</option>
                    <option value="MG">Madagascar</option>
                    <option value="MW">Malawi</option>
                    <option value="MY">Malaysia</option>
                    <option value="MV">Maldives</option>
                    <option value="ML">Mali</option>
                    <option value="MT">Malta</option>
                    <option value="MH">Marshall Islands</option>
                    <option value="MQ">Martinique</option>
                    <option value="MR">Mauritania</option>
                    <option value="MU">Mauritius</option>
                    <option value="YT">Mayotte</option>
                    <option value="MX">Mexico</option>
                    <option value="FM">Micronesia</option>
                    <option value="MD">Moldova</option>
                    <option value="MC">Monaco</option>
                    <option value="MN">Mongolia</option>
                    <option value="ME">Montenegro</option>
                    <option value="MS">Montserrat</option>
                    <option value="MA">Morocco</option>
                    <option value="MZ">Mozambique</option>
                    <option value="MM">Myanmar</option>
                    <option value="NA">Namibia</option>
                    <option value="NR">Nauru</option>
                    <option value="NP">Nepal</option>
                    <option value="NL">Netherlands</option>
                    <option value="AN">Netherlands Antilles</option>
                    <option value="NC">New Caledonia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="NI">Nicaragua</option>
                    <option value="NE">Niger</option>
                    <option value="NG">Nigeria</option>
                    <option value="NU">Niue</option>
                    <option value="NF">Norfolk Island</option>
                    <option value="KP">North Korea</option>
                    <option value="MP">Northern Mariana Islands</option>
                    <option value="NO">Norway</option>
                    <option value="OM">Oman</option>
                    <option value="PK">Pakistan</option>
                    <option value="PW">Palau</option>
                    <option value="PS">Palestinian Territory</option>
                    <option value="PA">Panama</option>
                    <option value="PG">Papua New Guinea</option>
                    <option value="PY">Paraguay</option>
                    <option value="PE">Peru</option>
                    <option value="PH">Philippines</option>
                    <option value="PN">Pitcairn</option>
                    <option value="PL">Poland</option>
                    <option value="PT">Portugal</option>
                    <option value="PR">Puerto Rico</option>
                    <option value="QA">Qatar</option>
                    <option value="RS">Republic of Serbia</option>
                    <option value="RE">Reunion</option>
                    <option value="RO">Romania</option>
                    <option value="RU">Russian Federation</option>
                    <option value="RW">Rwanda</option>
                    <option value="GS">S. Georgia/ Sandwich Islands</option>
                    <option value="SH">Saint Helena</option>
                    <option value="KN">Saint Kitts and Nevis</option>
                    <option value="LC">Saint Lucia</option>
                    <option value="PM">Saint Pierre and Miquelon</option>
                    <option value="VC">Saint Vincent/ Grenadines</option>
                    <option value="WS">Samoa</option>
                    <option value="SM">San Marino</option>
                    <option value="ST">Sao Tome and Principe</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="SN">Senegal</option>
                    <option value="SC">Seychelles</option>
                    <option value="SL">Sierra Leone</option>
                    <option value="SG">Singapore</option>
                    <option value="SK">Slovakia</option>
                    <option value="SI">Slovenia</option>
                    <option value="SB">Solomon Islands</option>
                    <option value="SO">Somalia</option>
                    <option value="ZA">South Africa</option>
                    <option value="KR">South Korea</option>
                    <option value="ES">Spain</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="SD">Sudan</option>
                    <option value="SR">Suriname</option>
                    <option value="SJ">Svalbard and Jan Mayen</option>
                    <option value="SZ">Swaziland</option>
                    <option value="SE">Sweden</option>
                    <option value="CH">Switzerland</option>
                    <option value="SY">Syrian Arab Republic</option>
                    <option value="TW">Taiwan</option>
                    <option value="TJ">Tajikistan</option>
                    <option value="TZ">Tanzania</option>
                    <option value="TH">Thailand</option>
                    <option value="TL">Timor-Leste</option>
                    <option value="TG">Togo</option>
                    <option value="TK">Tokelau</option>
                    <option value="TO">Tonga</option>
                    <option value="TT">Trinidad and Tobago</option>
                    <option value="TN">Tunisia</option>
                    <option value="TR">Turkey</option>
                    <option value="TM">Turkmenistan</option>
                    <option value="TC">Turks and Caicos Islands</option>
                    <option value="TV">Tuvalu</option>
                    <option value="VI">U.S. Virgin Islands</option>
                    <option value="UG">Uganda</option>
                    <option value="UA">Ukraine</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="GB">United Kingdom</option>                
                    <option value="US">United States</option>
                    <option value="UM">United States (M.O.I.)</option>
                    <option value="UY">Uruguay</option>
                    <option value="UZ">Uzbekistan</option>
                    <option value="VU">Vanuatu</option>
                    <option value="VE">Venezuela</option>
                    <option value="VN">Viet Nam</option>
                    <option value="WF">Wallis and Futuna</option>
                    <option value="EH">Western Sahara</option>
                    <option value="YE">Yemen</option>
                    <option value="ZM">Zambia</option>
                    <option value="ZW">Zimbabwe</option>
                </select>
            </div>
            <div class="col-12 my-0">
                <div class="hint mt-2 text-muted"><small>You can add the VAT code when downloading the invoice.</small></div>
            </div>
        </div>
    </div>
    <div class="form-row">
        <a id="payBtn" href="#!" class="paddle_button" class="btn mt-3 ml-auto pay-disabled">Get</a>
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
        <script type="text/javascript">
            Paddle.Setup({ vendor: 37055 });
        </script>
        <script>
            function openCheckout() {
                var form = document.getElementById('pre-checkout');
                var it = item();
                var _passthrough = {
                    organization: form.organization.value,
                    email: form.email.value,
                    address: it.free ? null: form.address.value,
                    country: it.free ? null: form.country.value,
                    zip: it.free ? null: form.zip.value
                };
                Paddle.Checkout.open({
                     product: it.productId,
                     email: form.email.value,
                     passthrough: JSON.stringify(_passthrough),
                     country: it.free ? "US": form.country.value,
                     postcode: it.free ? "10001": form.zip.value,
                     quantity: 1,
                     title: it.description,
                     locale: 'en'
                });
            }
            document.getElementById('payBtn').addEventListener('click', openCheckout, false);
            document.addEventListener('DOMContentLoaded', function() {
                    onChangeItem(function() {
                        recalculate();
                    });
                    Paddle.Setup({ vendor: 37055 });
                    //toggleButton();
                    onChangeForm(function() {
                        toggleButton();
                    });
            }, false);
            function onChangeItem(handler) {
                document.querySelector('#item').addEventListener('change', handler);
            }
            function item() {
                var idx = document.querySelector('#item').selectedIndex;
                var qtnTip = document.querySelector('#qtn-tip');
                var billing = document.querySelector('#billing');
                var address = document.querySelector('#address');
                var zip = document.querySelector('#zip');
                var country = document.querySelector('#country');
                switch (idx) {
                    case 0:
                        address.removeAttribute('required');
                        zip.removeAttribute('required');
                        country.removeAttribute('required');
                        billing.classList.add("d-none");
                        qtnTip.classList.add("d-none");
                        return { idx:0, free: true, description: "RESTHeart Platform 30 Days Trial", productId: 562478 };
                    default:
                        billing.classList.remove("d-none");
                        qtnTip.classList.remove("d-none");
                        address.setAttribute('required','');
                        zip.setAttribute('required','');
                        country.setAttribute('required','');
                        return { idx:1, free: false, price: '$ 499', description: "RESTHeart Platform Professional Edition", productId: 563538 }; 
                }
            }
            function recalculate() {
                var it = item();
                document.querySelector('#price').value = it.free ? "Free" : it.price;
                document.querySelector('#item').value = it.idx;
                toggleButton();              
            }
            function isValid() {
                return document.querySelector('#pre-checkout').checkValidity();
            }
            function toggleButton() {
                var button = document.querySelector('#payBtn');
                if (isValid()) {
                    button.classList.remove("pay-disabled");
                } else {
                    button.classList.add("pay-disabled");
                }
            }
            function onChangeForm(handler) {
                document.querySelector('#pre-checkout').addEventListener('input', handler);
            }
        </script>
    </div>
</form>

</div>
<hr>

<div class="alert alert-info mb-5">
    Confused on which version to choose? Check our <a href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}">FAQs</a> to learn more about the main differences between editions.
</div>
<div class="alert mt-5 mb-2 text-muted">
    Searching for the Open Source version? Check out <a href="https://github.com/SoftInstigate/restheart" target="_blank">RESTHeart</a> and <a href="https://github.com/SoftInstigate/restheart-security" target="_blank">RESTHeart Security</a> GitHub repositories
</div>


<hr class="mb-5">