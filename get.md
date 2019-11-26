---
layout: page-notitle
title: Get RESTHeart Platform
permalink: /get
---

<div class="form-row text-center mt-4">
    <p class="mx-auto display-4 restheart-red">Try and Purchase <img width="30%"  src="{{ 'images/rh_logo_vert.png' | prepend: site.baseurl }}" /></p>
</div>

<section class="mt-4 call-to-action">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__first">
                <svg class="call-to-action__icon">
                    <use xlink:href="/images/sprite.svg#lamp" /></svg>
                <h2 class="call-to-action__title">Trial</h2>
                <p class="call-to-action__desc">
                Get 30 days trial for free.
                During the trial you can use RESTHeart Platform PE without restrictions.</p>
            </div>
            <div class="col-md-6 mb-5 call-to-action__item call-to-action__second">
                <svg class="call-to-action__icon">
                    <use xlink:href="/images/sprite.svg#thumb" /></svg>
                <h2 class="call-to-action__title">Full License Key</h2>
                <p class="call-to-action__desc">Purchase RESTHeart Platform Professional Edition for $499. For other editions please <a class="text-white" href="/contact"><strong>contact</strong></a> us.</p>
            </div>
        </div>
    </div>
</section>

<div class="jumbotron bg-light mt-4 py-4">
<form id="pre-checkout" novalidate class="was-validated">
    <div class="form-row">
        <small class="col-12 mb-4 text-muted hint">
            Select <mark class="text-muted">30 Days Trial</mark> or <mark class="text-muted">Professional Edition</mark> below
        </small>
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
            <div class="hint mt-2 text-muted"><small>You can specify quantities during checkout.</small></div>
            <div class="hint mt-2 text-muted"><small>Shown prices don't include VAT or other sales taxes, where applicable.</small></div>
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
    <div id="need">
        <hr class="my-4">
        <div class="form-row mt-2">
            <h2 class="text-info">Please describe your need</h2><span class="text-sm text-info">&nbsp;&nbsp;optional</span>
        </div>
        <div class="form-row">
            <div class="col-md-6 mb-3">
                <h3 class="text-info mb-3">Scenario</h3>
                <div class="form-check">
                <input class="form-check-input" type="radio" name="needs" id="needOSS">
                <label class="form-check-label lead" for="needOSS">Experimenting or personal use</label>
                </div>
                <div class="form-check mt-2">
                <input class="form-check-input" type="radio" name="needs" id="needRef">
                <label class="form-check-label lead text-red" for="needRef">Developing a solution for your customer</label>
                </div>
                <div class="form-check mt-2">
                <input class="form-check-input" type="radio" name="needs" id="needEnt">
                <label class="form-check-label lead" for="needEnt">Developing an Enterprise Application</label>
                </div>
                <div class="form-check mt-2">
                <input class="form-check-input" type="radio" name="needs" id="needOEM">
                <label class="form-check-label lead" for="needOEM">Embed RESTHeart Platform in your product or service</label>
                </div>
                <div class="form-check mt-2">
                <input class="form-check-input" type="radio" name="needs" id="needOth">
                <label class="form-check-label lead" for="needOth">Other</label>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <h3 class="text-info mb-3">Use case</h3>
                <div class="form-check">
                <input class="form-check-input" type="checkbox" name="usecases" id="usecaseWebMobileApp">
                <label class="form-check-label lead text-red" for="usecaseWebMobileApp">Backend for Mobile or Web App</label>
                </div>
                <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" name="usecases" id="usecaseCMS">
                <label class="form-check-label lead" for="usecaseCMS">Content Management and Delivery</label>
                </div>
                <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" name="usecases" id="usecaseAPI">
                <label class="form-check-label lead" for="usecaseAPI">Add an API to an service that uses MongoDB</label>
                </div>
                <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" name="usecases" id="usecaseIntegration">
                <label class="form-check-label lead" for="usecaseIntegration">Integrate with MongoDB via REST API</label>
                </div>
                <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" name="usecases" id="usecaseOpenDataIoT">
                <label class="form-check-label lead" for="usecaseOpenDataIoT">Open Data or Internet of Things</label>
                </div>
                <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" name="usecases" id="usecaseOther">
                <label class="form-check-label lead" for="usecaseOther">Other</label>
                </div>
            </div>
            <div class="col-md-12 mb-3">
                <div id="tipOSS" class="d-none">
                    <p class="lead">You might want to try the free OSS version.</p>
                    <p>If you are a student or an educator at high schools, universities and colleges you can use RESTHeart Platform PE free of charge. See <i class="">Discounts for Education</i> below for more information.</p>
                </div>
                <div id="tipRef" class="d-none lead">
                    <strong>You are eligible for 20% of the license price according to our referral program.</strong> 
                    <p><a href="/contact">Contact us</a> to register your deal.</p>
                </div>
                <p id="tipEnt" class="d-none lead"><a href="/contact">Contact us</a> for a tailored offer for RESTHeart Platform Enterprise Edition</p>
                <p id="tipOEM" class="d-none lead"><a href="/contact">Contact us</a> for a tailored offer for RESTHeart Platform OEM Edition</p>
                <div id="tipOth" class="d-none lead">
                <p>We'd love to better know your needs to help us improving RESTHeart.</p>
                <p>You can provide feedback <a href="/contact">contacting us</a>.</p>
                </div>
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
                    zip: it.free ? null: form.zip.value,
                    need: need(),
                    useCases: useCases()
                };
                console.log(_passthrough);
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
                    onChangeForm(function() {
                        toggleButton();
                    });
                    onChangeNeed(function() {
                        showNeedTip();
                    });
                    var iqp = location.href.match(/[?&]i=(.*?)(?:$|&)/)[1];   // get params "u" from URL
                    if (iqp && iqp === 'buy') {
                        var item = document.querySelector('#item');
                        item.selectedIndex = 1;
                        item.dispatchEvent(new Event('change'));
                    }
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
                var need = document.querySelector('#need');
                switch (idx) {
                    case 0:
                        address.removeAttribute('required');
                        zip.removeAttribute('required');
                        country.removeAttribute('required');
                        billing.classList.add("d-none");
                        qtnTip.classList.add("d-none");
                        need.classList.remove("d-none");
                        return { idx:0, free: true, description: "RESTHeart Platform 30 Days Trial", productId: 562478 };
                    default:
                        billing.classList.remove("d-none");
                        qtnTip.classList.remove("d-none");
                        need.classList.add("d-none");
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
            function onChangeNeed(handler) {
                document.querySelector('#need').addEventListener('change', handler);
            }
            function needIdx() {
                var needs = [ '#needOSS', '#needRef', '#needEnt', '#needOEM', '#needOth' ];
                var idx = 0;
                while (idx < needs.length) {
                    if (document.querySelector(needs[idx]).checked) {
                        return idx;
                    }
                    idx++;
                }
                return -1;
            }
            function showNeedTip() {
                var checkedIdx = needIdx();
                var tips = [ '#tipOSS', '#tipRef', '#tipEnt', '#tipOEM', '#tipOth' ];
                for (var idx = 0; idx < tips.length; idx++) {
                    var tip = document.querySelector(tips[idx]);
                    if (idx == checkedIdx) {
                        tip.classList.remove("d-none");
                    } else {
                        tip.classList.add("d-none");
                    }
                }
            }
            function need() {
                var needsDescriptions = [
                    'Experimenting or personal use',
                    'Developing a solution for your customer',
                    'Developing an Enterprise Application',
                    'Embed RESTHeart Platform in your product or service',
                    'Other'
                ];
                var idx = needIdx();
                if (idx >= 0) {
                    return needsDescriptions[idx];
                } else {
                    return 'None specified';
                }
            }
            function useCases() {
                var useCases = [ '#usecaseWebMobileApp', '#usecaseCMS', '#usecaseAPI', '#usecaseIntegration', '#usecaseOpenDataIoT', '#usecaseOther' ];
                var useCaseDescriptions = [
                    'Backend for Mobile or Web App', 
                    'Content Management and Delivery',
                    'Add an API to an service that uses MongoDB',
                    'Integrate with MongoDB via REST API',
                    'Open Data or Internet of Things',
                    'Other'
                ];
                var ret = [];
                for (var idx = 0; idx < useCases.length; idx++) {
                    if (document.querySelector(useCases[idx]).checked) {
                        ret.push(useCaseDescriptions[idx]);
                    }
                }
                return ret.length == 0 ? 'None specified' : ret.join(', ');
            }
        </script>
    </div>
</form>

</div>

<div class="alert text-muted">
    Looking for the Open Source version? Check out <a href="https://github.com/SoftInstigate/restheart" target="_blank">RESTHeart</a> and <a href="https://github.com/SoftInstigate/restheart-security" target="_blank">RESTHeart Security</a> GitHub repositories
</div>

<div class="alert alert-info mb-5">
    Confused on which version to choose? Check our <a href="{{ "/faq/#os-vs-pe" | prepend: site.baseurl }}">FAQs</a> to learn more about the main differences between editions.
</div>

<div class="jumbotron bg-light">
    <h1>Discounts for Education</h1>
    <p>Students and educators at high schools, universities and colleges may use RESTHeart Platform PE free of charge. Students qualify for a one-year subscription each year they are enrolled in classes. Teachers and professors receive licenses to use in classrooms and computer labs.</p>
    <p>We also provide discounts to academic, non-profit, and government organizations for RESTHeart Platform EE licenses purchased by PO.</p>
    <div class="row lead text-center">
        <div class="col-md-4">EDUCATIONAL: 60% OFF</div>
        <div class="col-md-4">NON-PROFIT: 60% OFF</div>
        <div class="col-md-4">GOVERNMENT: 25% OFF</div>
    </div>
    <div class="row text-center mt-5">
        <div class="offset-md-4 col-md-4">
            <a href="/contact" class="btn btn-md">Request discount</a>
        </div>
    </div>
</div>

<div class="jumbotron bg-light mb-5">
    <h1>Licensing FAQ</h1>
    <div class="row">
        <div class="col-md-6">
            <div class="lead mb-2 text-primary">Is the the license perpetual?</div>
            <p><span class="text-success">Yes</span> all licenses for RESTHeart Platform are perpetual; RESTHEart Platform can be always used with a license key and there are no time limits.</p>
            <!-- question -->
            <div class="lead mt-4 mb-2 text-primary">What is the subscription?</div>
            <p>License includes 1 year subscription. During this period
            you can ask for support and RESTHeart Platform can be upgraded.
             You cannot ask for support or upgrade RESTHeart Plafrom to releases that are published after the subscription period.</p>
            <!-- question -->
            <div class="lead mt-4 mb-2 text-primary">How subscription is renewed?</div>
            <p>To extend the subscription, you need a new License Key.
            <a href="/contact">Contact us</a> to get the renewal coupon to apply the 20% renewal discount to the license key price.</p>
            <!-- question -->
            <div class="lead mt-4 mb-2 text-primary">How to get the invoice?</div>
            <p>During checkout you can add your VAT code.
            The invoice is therefore sent via email, with a copy in the email body and as a PDF attachment.
            You can also download an invoice as a PDF to save a copy for your records or ask us a copy at any time.
            </p>
        </div>
        <div class="col-md-6">
            <div class="lead mb-2 text-primary">What is the license?</div>
            <p>See <a href="https://github.com/SoftInstigate/restheart/blob/master/COMM-LICENSE.txt">COMM-LICENSE</a> in the root of the RESTHeart repo.</p>
            <!-- question -->
            <div class="lead mt-4 mb-2 text-primary">What is a License Key?</div>
            <p>A <i>License Key</i> is a verifiable file, cryptographically signed by the Licensor, containing additional information on the License (including but not limited to those that specifies how many RESTHeart instances the Licensee is allowed to execute and how) that can purchased by the Licensee in order to acquire the rights to use RESTHeart.</p>
            <!-- question -->
            <div class="lead mt-4 mb-2 text-primary">What is a RESTHeart instance?</div>
            <p>A <i>RESTHeart instance</i> is any installation of RESTHeart and Derivative Works of RESTHeart capable of being executed as a single process in a production execution environment regardless the used technology, including but not limited to bare metal servers, virtual machines or containers. Installations made for testing or development purposes don’t constitute RESTHeart instances.</p>
        </div>
    </div>
</div>