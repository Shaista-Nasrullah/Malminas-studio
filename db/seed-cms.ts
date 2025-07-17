// In db/seed-cms.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- Page Content Definitions ---

const aboutUsContent = `
<p>Kuchi Jewels is a project of ROYAL TRADE which is a leading exporter in all over the world. Our company has experienced, educated and motivated staff. Our main goal is to meet the domestic and international standard B2C and B2B export target with competitive prices and high quality products. We wish that our company should be known with the name of our product quality.</p><p>Kuchi jewels is a platform from where we supplying unique and handmade tribal jewelry to different part of the world. Our product’s quality is our identity. Tribal products are the most liking and using items in traditional as well as party functions. Artificial stones, mirrors, colorful plastic and German silver are used in creation of these products. Afghani workers prove their professional skills by creating amazing and unique designs of jewelry. Our product line cover the all jewelry items like tribal Necklaces, Afghani Bracelet, Belly dance belts , body chains, Kuchi Boot cover, Kuchi Ear Rings, Afghan Rings, Handmade Medallions, Fabric Patches, Metal accessories, Old accessories, Unique coins, head wears, Chokers, Five rings bracelet, embroidery trims. Metal Kuchi Anklets, antique pieces Cap, Sindhi Pouches, Afghan Bags, Afghani dresses, Jewelry boxes, Kuchi Ponchos and many more.</p><p>We also provide on demand creation/styles to our customers which are purely handmade and achieve all quality level and requirements.</p><p>Our order delivery is also according to customer’s requirement, we believe in fast and secure delivery at customer door step.</p><div style="text-align: center;"><p></p><h2>Our Mission</h2><p>To be a strong and dynamic set up providing creative innovative, stimulating advanced era fashion product to meet and satisfy customer’s need and requirement, for the benefits of the industry and community</p><h2>Our People</h2><p>Our committed team of sales and marketing engineers, coupled with their extensive experience and broad application know-how, always strive to provide excellent service & feasible solution to our valued Customers, Our people are consistently trained & updated with product knowledge provide of competent service to our reverent Customers about need definition, products specification, solutions offering to prompt delivery of goods, service and after sales support with our expertise, we are certainly capable to offer the RIGHT PRODUCT at the RIGHT PRICE to the RIGHT CUSTOMERS for the benefits of the industry and community.</p></div><h2>Registration/Membership</h2><p>We are registered members of the following government departments,</p><ul><li><p>Member of All Pakistan Commercial Export Association of Precious and semi precious stones.</p></li><li><p>Member of Faisalabad Chamber of Commerce & Industry Pakistan.</p></li><li><p>Sales Tax department of government of Pakistan.</p></li><li><p>Income Tax department of government of Pakistan.</p></li><li><p>REX System TDAP</p></li><li><p>Registered TM from IPO</p></li></ul><h2>Ownership</h2><p><strong>Mr. Muhammad Usman Raza</strong></p><p>Faisalabad 38000. Pakistan</p>
`;

const shippingPolicyContent = `
<h2>FOR INTERNATIONAL CUSTOMERS</h2>
<p>International orders will dispatch within 7 to 8 days after confirmation of payment, FedEx will deliver within 3 to 5 working days.</p>
<h2>Shipping Policy for international customers</h2>
<ul>
  <li><p>Shipping charges USD.60 on order amount USD.10 to USD.250</p></li>
  <li><p>Shipping charges USD.110 on order amount USD.251 to USD.500</p></li>
  <li><p>Shipping charges USD.190 on order amount USD.501 to USD.800</p></li>
  <li><p>Shipping charges USD.250 on order amount USD.801 to USD.1100</p></li>
  <li><p>Shipping charges USD.300 on order amount USD.1101 to USD.1500</p></li>
  <li><p>Shipping charges USD.400 on order amount USD.1501 to USD.5000</p></li>
</ul>
<p>Flat Shipping Charges within Pakistan USD.1.8</p>
<p><strong>-:RUSSIAN SHIPMENTS ARE ONLY ACCEPTABLE FROM REGISTERED COMPANIES.</strong></p>
<p><strong>-: SHIPMENTS ARE PERMANENTLY CLOSED TO ISRAEL :-</strong></p>
`;

const termsAndConditionsContent = `
<p>These terms and conditions (“Terms and Conditions”) apply to the Site, and all of its divisions, subsidiaries, and affiliate operated Internet sites which reference these Terms and Conditions. By accessing the Site, you confirm your understanding of the Terms and Conditions. If you do not agree to these Terms and Conditions of use, you shall not use this website. The Site reserves the right, to change, modify, add, or remove portions of these Terms and Conditions of use at any time. Changes will be effective when posted on the Site with no other notice provided. Please check these Terms and Conditions of use regularly for updates. Your continued use of the Site following the posting of changes to these Terms and Conditions of use constitutes your acceptance of those changes.</p><h2>USE OF THE SITE</h2><p>You are either at least 18 years of age or are accessing the Site under the supervision of a parent or legal guardian. We grant you a non-transferable and revocable license to use the Site, under the Terms and Conditions described, for the purpose of shopping for personal items sold on the Site. Commercial use or use on behalf of any third party is prohibited, except as explicitly permitted by us in advance. Any breach of these Terms and Conditions shall result in the immediate revocation of the license granted in this paragraph without notice to you.</p><p>Content provided on this site is solely for informational purposes. Product representations expressed on this Site are those of the vendor and are not made by us. Submissions or opinions expressed on this Site are those of the individual posting such content and may not reflect our opinions.</p><p>Certain services and related features that may be made available on the Site may require registration or subscription. Should you choose to register or subscribe for any such services or related features, you agree to provide accurate and current information about yourself, and to promptly update such information if there are any changes. Every user of the Site is solely responsible for keeping passwords and other account identifiers safe and secure. The account owner is entirely responsible for all activities that occur under such password or account.</p><p>Furthermore, you must notify us of any unauthorized use of your password or account. The Site shall not be responsible or liable, directly or indirectly, in any way for any loss or damage of any kind incurred as a result of, or in connection with, your failure to comply with this section.</p><p>During the registration process you agree to receive promotional emails from the Site. You can subsequently opt out of receiving such promotional e-mails by clicking on the link at the bottom of any promotional email.</p><p>We work to ensure that listed items do not infringe upon the copyright, trademark or other intellectual property rights of third parties. If you believe that your intellectual property rights have been infringed, please notify our team and we will investigate.</p><h2>USER SUBMISSIONS</h2><p>Anything that you submit to the Site and/or provide to us, including but not limited to, questions, reviews, comments, and suggestions (collectively, “Submissions”) will become our sole and exclusive property and shall not be returned to you. In addition to the rights applicable to any Submission, when you post comments or reviews to the Site, you also grant us the right to use the name that you submit, in connection with such review, comment, or other content. You shall not use a false e-mail address, pretend to be someone other than yourself or otherwise mislead us or third parties as to the origin of any Submissions. We may, but shall not be obligated to, remove or edit any Submissions.</p><h2>ORDER ACCEPTANCE AND PRICING</h2><p>Please note that there are cases when an order cannot be processed for various reasons. The Site reserves the right to refuse or cancel any order for any reason at any given time. You may be asked to provide additional verifications or information, including but not limited to phone number and address, before we accept the order. We are determined to provide the most accurate pricing information on the Site to our users; however, errors may still occur, such as cases when the price of an item is not displayed correctly on the website. As such, we reserve the right to refuse or cancel any order. In the event that an item is mispriced, we may, at our own discretion, either contact you for instructions or cancel your order and notify you of such cancellation. We shall have the right to refuse or cancel any such orders whether or not the order has been confirmed and your debit/credit card charged.</p><h2>RETURN AND CLAIM CONDITIONS</h2><p>In case of any damage or claim return, the shipping cost will not be payback . If any customer wants to send back the goods he/she will pay the return shipping. We will issue them refund after checking the damage/faulty products. Refund will issue within a week after getting the damage goods.</p><h2>TRADEMARKS AND COPYRIGHTS</h2><p>All intellectual property rights, whether registered or unregistered, in the Site, information content on the Site and all the website design, including, but not limited to, text, graphics, software, photos, video, music, sound, and their selection and arrangement, and all software compilations, underlying source code and software shall remain our property. The entire contents of the Site also are protected by copyright as a collective work under international conventions. All rights are reserved.</p><h2>LEGAL DISPUTES</h2><p>If a dispute arises between you and kuchijewelleryonlinestore.com, our goal is to provide you with a neutral and cost effective means of resolving the dispute quickly. Accordingly, you and ‘kuchijewelleryonlinestore.com’ agree that we will resolve any claim or controversy at law or equity that arises out of this Agreement or our services in accordance with one of the subsections below or as we and you otherwise agree in writing. Before resorting to these alternatives, we strongly encourage you to first contact us directly to seek a resolution. We will consider reasonable requests to resolve the dispute through alternative dispute resolution procedures, such as arbitration, as alternatives to litigation.</p><h2>INDEMNITY</h2><p>You will indemnify and hold us (and our officers, directors, agents, subsidiaries, joint ventures and employees) harmless from any claim or demand, including reasonable attorneys’ fees, made by any third party due to or arising out of your breach of this Agreement, or your violation of any law or the rights of a third party.</p><h2>NO AGENCY</h2><p>No agency, partnership, joint venture, employee-employer or franchiser-franchisee relationship is intended or created by this Agreement.</p><h2>NOTICES</h2><p>We shall send notices to you by email to the email address you provide to ‘kuchijewelleryonlinestore.com’ during the registration process. Notice shall be deemed given 24 hours after email is sent, unless the sending party is notified that the email address is invalid. Alternatively, we may give you legal notice by registered mail to the address provided during the registration process. Notices sent to you by registered mail shall be deemed to have been received by that party three days after the date of mailing.</p><h2>TERMINATION</h2><p>In addition to any other legal or equitable remedies, we may, without prior notice to you, immediately terminate the Terms and Conditions or revoke any or all of your rights granted under the Terms and Conditions. Upon any termination of this Agreement, you shall immediately cease all access to and use of the Site and we shall, in addition to any other legal or equitable remedies, immediately revoke all password(s) and account identification issued to you and deny your access to and use of this Site in whole or in part. Any termination of this agreement shall not affect the respective rights and obligations (including without limitation, payment obligations) of the parties arising before the date of termination. You furthermore agree that the Site shall not be liable to you or to any other person as a result of any such suspension or termination.</p>
`;

const refundAndReturnPolicyContent = `
<p>Thank you for choosing Kuchi Jewels. This Refund and Return Policy outlines our procedures for returns and refunds to ensure your satisfaction with our products.</p><h2>Returns</h2><ul><li><p>We accept returns within 7 days from the date of purchase.</p></li><li><p>To be eligible for a return, the item must be unused, in its original condition, and in the original packaging.</p></li></ul><h2>Refunds</h2><ul><li><p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund.</p></li><li><p>If approved, the refund will be processed, and a credit will automatically be applied to your original method of payment within 7 days.</p></li></ul><h2>Exchanges</h2><p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, contact us at [insert email/phone] for further instructions.</p><h2>Non-Returnable Items</h2><p>Several types of goods are exempt from being returned, including custom orders and items marked as final sale.</p><h2>Shipping Costs</h2><p>Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p><h2>How to Initiate a Return</h2><p>To initiate a return, please contact us at sales@kuchijewels.com with your order number and details about the product you would like to return.</p><p>We will provide you with return instructions, including the return address.</p><h2>Damaged or Defective Items</h2><p>If you receive a damaged or defective item, please contact us immediately with photos of the damaged item. We will assess the situation and provide further instructions.</p><h2>Late or Missing Refunds</h2><p>If you haven’t received a refund within the specified timeframe, first check your bank account. If the issue persists, contact your credit card company or bank, as it may take some time before your refund is officially posted.</p><h2>Contact Us</h2><p>If you have any questions about our Refund and Return Policy, please contact us at [insert email/phone].</p><p>By making a purchase on Kuchi Jewels, you agree to and acknowledge the terms outlined in this Refund and Return Policy. We appreciate your understanding and cooperation.</p><p>Thank you for choosing Kuchi Jewels.</p>
`;

// --- NEWLY ADDED CONTENT ---

const privacyPolicyContent = `
<p>Thank you for choosing Kuchi Jewels. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website.</p>
<h2>Information We Collect</h2>
<ul>
  <li><p><strong>Personal Information:</strong> When you place an order, we collect personal information such as your name, address, email, and payment details. This information is necessary for order processing and fulfillment.</p></li>
  <li><p><strong>Website Usage Data:</strong> We may collect non-personal information about how you interact with our website, including your IP address, browser type, and pages visited. This data helps us improve our site and enhance your experience.</p></li>
</ul>
<h2>How We Use Your Information</h2>
<ul>
  <li><p><strong>Order Processing:</strong> We use your personal information to process and fulfill your orders. This includes communication regarding your purchase and shipment updates.</p></li>
  <li><p><strong>Improving Our Services:</strong> Non-personal information is used to analyze website usage patterns, helping us enhance our services, optimize content, and tailor our marketing strategies.</p></li>
</ul>
<h2>Information Sharing</h2>
<ul>
  <li><p><strong>Third-Party Service Providers:</strong> We may share your personal information with trusted third-party service providers involved in order processing, shipping, and payment processing. These entities are obligated to maintain the confidentiality and security of your information.</p></li>
  <li><p><strong>Legal Compliance:</strong> We may disclose your information if required by law or in response to legal requests.</p></li>
</ul>
<h2>Security</h2>
<p>We prioritize the security of your information and employ industry-standard measures to protect against unauthorized access, disclosure, alteration, or destruction.</p>
<h2>Cookies</h2>
<p>Our website uses cookies to enhance your browsing experience. You can adjust your browser settings to reject cookies, but this may affect certain functionalities.</p>
<h2>Your Choices</h2>
<p>You have the right to update or correct your personal information. If you wish to opt-out of receiving marketing communications, please contact us.</p>
<h2>Changes to This Privacy Policy</h2>
<p>We may update our Privacy Policy to reflect changes in our practices. The date of the latest revision will be indicated at the top of this page.</p>
<h2>Contact Us</h2>
<p>If you have questions about our Privacy Policy or wish to exercise your rights, please contact us at [insert email/phone].</p>
<p>By using our website, you consent to the terms outlined in this Privacy Policy. Thank you for trusting Kuchi Jewels with your information.</p>
`;

const faqsContent = `
<h2>Do you ship internationally?</h2>
<p>Yes, Kuchi Jewels is a well-known leading exporter, and we ship worldwide. We can deliver anywhere you want. (Except India And Israel).</p>
<h2>Who should I contact if I have any queries?</h2>
<p>Our Phone numbers and email addresses are available on our contact page, through which you can contact us for any queries. Our highly cooperative team will get in touch with you as soon as possible.</p>
<h2>How long will it take to get my package?</h2>
<p>We deliver the package accordingly to the requirement of the customers. If it’s a small package that consists of only a few products, it will take a maximum of 5-6 days, and a bulk order will be delivered in around 8-10 days. Our team tries to deliver the product to you as fast as possible at the doorsteps.</p>
<h2>Can I get a customized product from your website?</h2>
<p>Yes, we offer our customers the option to order the jewelry as per their requirements. You can contact our team, and we will assist you with a top-quality product according to your needs.</p>
<h2>Do you sell products wholesale?</h2>
<p>Yes, mainly we are selling to B2B in bulk quality. We aim to deliver the best B2B services for our customers.</p>
<h2>Does your product line have traditional afghan jewelry?</h2>
<p>Yes, we have amazingly designed antique Afghan jewelry in our collection. You can buy Afghani Bracelets, rings, caps, earrings, chokers, and various other products from our collection.</p>
<h2>Do you sell any fabric?</h2>
<p>Yes, you can also find beautiful, high-quality fabrics such as cotton, linen, and silk. Our pure-quality fabrics are available at affordable rates.</p>
<h2>What other item can I get from you?</h2>
<p>At Kuchi Jewels, we also sell other items, including yet not limited to:</p>
<ul>
  <li><p>Face mask</p></li>
  <li><p>Embroidered trims</p></li>
  <li><p>Embroidered and fancy pillow cushions</p></li>
</ul>
<h2>Do you sell Afghani Rubab?</h2>
<p>Yes, you can also find wooden Afghani Rubab in our music product section. It is 90 cm long and 28 cm in width. The instrument has a dimensional weight of 10 kg and is ready for sale.</p>
<h2>What courier company do you use?</h2>
<p>We use FedEx and DHL to send our products to customers. Also use by sea in case of bulk shipments.</p>
`;

const refundPolicyShortContent = `
<p>Customer can return items within 14 days, They have to pay return shipping charges. We will refund or replace items according to customer demand.</p>
`;

const termsOfServiceContent = `
<h2>OVERVIEW</h2><p>This website is operated by Kuchijewels Pk. Throughout the site, the terms “we”, “us” and “our” refer to Kuchijewels Pk. Kuchijewels Pk offers this website, including all information, tools and Services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p><p>By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content.</p><p>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any Services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.</p><p>Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.</p><p>Our store is hosted on Shopify Inc. They provide us with the online e-commerce platform that allows us to sell our products and Services to you.</p>
<h2>SECTION 1 - ONLINE STORE TERMS</h2><p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.</p><p>You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p><p>You must not transmit any worms or viruses or any code of a destructive nature.</p><p>A breach or violation of any of the Terms will result in an immediate termination of your Services.</p>
<h2>SECTION 2 - GENERAL CONDITIONS</h2><p>We reserve the right to refuse Service to anyone for any reason at any time.</p><p>You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.</p><p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the Service is provided, without express written permission by us.</p><p>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
<h2>SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h2><p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.</p><p>This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.</p>
<h2>SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES</h2><p>Prices for our products are subject to change without notice.</p><p>We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p><p>We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.</p>
<h2>SECTION 5 - PRODUCTS OR SERVICES (if applicable)</h2><p>Certain products or Services may be available exclusively online through the website. These products or Services may have limited quantities and are subject to return or exchange only according to our Refund Policy: <a href="/pages/refund-and-return-policy">LINK TO REFUND POLICY</a></p><p>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p><p>We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis. We reserve the right to limit the quantities of any products or Services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time. Any offer for any product or Service made on this site is void where prohibited.</p><p>We do not warrant that the quality of any products, Services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.</p>
<h2>SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION</h2><p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, a single credit card, and/or orders that use the same billing and/or shipping address. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e‑mail and/or billing address/phone number provided at the time the order was made. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers or distributors.</p><p>You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.</p><p>For more details, please review our Refund Policy: <a href="/pages/refund-and-return-policy">LINK TO REFUND POLICY</a></p>
<h2>SECTION 7 - OPTIONAL TOOLS</h2><p>We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.</p><p>You acknowledge and agree that we provide access to such tools ”as is” and “as available” without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.</p><p>Any use by you of the optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).</p><p>We may also, in the future, offer new Services and/or features through the website (including the release of new tools and resources). Such new features and/or Services shall also be subject to these Terms of Service.</p>
<h2>SECTION 8 - THIRD-PARTY LINKS</h2><p>Certain content, products and Services available via our Service may include materials from third-parties.</p><p>Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or Services of third-parties.</p><p>We are not liable for any harm or damages related to the purchase or use of goods, Services, resources, content, or any other transactions made in connection with any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.</p>
<h2>SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS</h2><p>If, at our request, you send certain specific submissions (for example contest entries) or without a request from us, you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments.</p><p>We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party’s intellectual property or these Terms of Service.</p><p>You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain libelous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website. You may not use a false e‑mail address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.</p>
<h2>SECTION 10 - PERSONAL INFORMATION</h2><p>Your submission of personal information through the store is governed by our Privacy Policy, which can be viewed here: <a href="/pages/privacy-policy">LINK TO PRIVACY POLICY</a></p>
<h2>SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS</h2><p>Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice (including after you have submitted your order).</p><p>We undertake no obligation to update, amend or clarify information in the Service or on any related website, including without limitation, pricing information, except as required by law. No specified update or refresh date applied in the Service or on any related website, should be taken to indicate that all information in the Service or on any related website has been modified or updated.</p>
<h2>SECTION 12 - PROHIBITED USES</h2><p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet; (h) to collect or track the personal information of others; (i) to spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet. We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.</p>
<h2>SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY</h2><p>We do not guarantee, represent or warrant that your use of our Service will be uninterrupted, timely, secure or error-free.</p><p>We do not warrant that the results that may be obtained from the use of the Service will be accurate or reliable.</p><p>You agree that from time to time we may remove the Service for indefinite periods of time or cancel the Service at any time, without notice to you.</p><p>You expressly agree that your use of, or inability to use, the Service is at your sole risk. The Service and all products and Services delivered to you through the Service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement.</p><p>In no case shall Kuchijewels Pk, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, Service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the Service or any products procured using the Service, or for any other claim related in any way to your use of the Service or any product, including, but not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the Service or any content (or product) posted, transmitted, or otherwise made available via the Service, even if advised of their possibility. Because some states or jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, our liability shall be limited to the maximum extent permitted by law.</p>
<h2>SECTION 14 - INDEMNIFICATION</h2><p>You agree to indemnify, defend and hold harmless Kuchijewels Pk and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, Service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.</p>
<h2>SECTION 15 - SEVERABILITY</h2><p>In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.</p>
<h2>SECTION 16 - TERMINATION</h2><p>The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.</p><p>These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.</p><p>If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).</p>
<h2>SECTION 17 - ENTIRE AGREEMENT</h2><p>The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.</p><p>These Terms of Service and any policies or operating rules posted by us on this site or in respect to the Service constitutes the entire agreement and understanding between you and us and governs your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).</p><p>Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.</p>
<h2>SECTION 18 - GOVERNING LAW</h2><p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Pakistan.</p>
<h2>SECTION 19 - CHANGES TO TERMS OF SERVICE</h2><p>You can review the most current version of the Terms of Service at any time at this page.</p><p>We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.</p>
<h2>SECTION 20 - CONTACT INFORMATION</h2><p>Questions about the Terms of Service should be sent to us at kuchijewels.net@gmail.com.</p><p>Our contact information is posted below:</p><p>[INSERT TRADING NAME]</p><p>kuchijewels.net@gmail.com</p><p>[INSERT BUSINESS ADDRESS]</p><p>[INSERT BUSINESS PHONE NUMBER]</p><p>[INSERT BUSINESS REGISTRATION NUMBER]</p><p>[INSERT VAT NUMBER]</p>
`;

const contactInformationContent = `
<p><strong>Trade name:</strong> Kuchijewels Pk</p>
<p><strong>Phone number:</strong> 03336820900</p>
<p><strong>Email:</strong> kuchijewels.net@gmail.com</p>
<p><strong>Physical address:</strong> Kuchi Jewels, National Colony, Faisalabad 38000, Pakistan</p>
<p><strong>VAT number:</strong></p>
<p><strong>Trade number:</strong></p>
`;

// --- The Main Array of All Pages ---
const pagesToSeed = [
  {
    slug: "about-us",
    title: "About Us",
    content: aboutUsContent,
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    content: shippingPolicyContent,
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    content: termsAndConditionsContent,
  },
  {
    slug: "refund-and-return-policy",
    title: "Refund and Return Policy",
    content: refundAndReturnPolicyContent,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: privacyPolicyContent,
  },
  {
    slug: "faqs",
    title: "FAQs",
    content: faqsContent,
  },
  {
    slug: "refund-policy",
    title: "Refund policy",
    content: refundPolicyShortContent,
  },
  {
    slug: "terms-of-service",
    title: "Terms of service",
    content: termsOfServiceContent,
  },
  {
    slug: "contact-information",
    title: "Contact information",
    content: contactInformationContent,
  },
];

// --- The Seeding Function ---
async function main() {
  console.log(`Start seeding CMS pages...`);
  for (const page of pagesToSeed) {
    const result = await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
      },
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content,
      },
    });
    console.log(`Upserted page: ${result.title}`);
  }
  console.log(`CMS page seeding finished.`);

  // --- NEW: Seed the initial announcement ---
  console.log("Seeding initial announcement...");
  // Use upsert to avoid creating duplicates on re-seed
  await prisma.announcement.upsert({
    where: { id: "initial-summer-sale" }, // A fixed ID for the first announcement
    update: {}, // Don't overwrite if it exists
    create: {
      id: "initial-summer-sale",
      text: "SUMMER SALE GET UPTO 30% OFF",
      isActive: true, // Make the first one active by default
    },
  });
  console.log("Announcement seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
