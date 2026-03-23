(function() {
    'use strict';

    var knowledge = {
        shopName: 'Golden Barbers Goodmayes',
        phoneDisplay: '020 8598 9920',
        phoneHref: '02085989920',
        whatsappPhone: '447858232531',
        locationHtml: "14 Goodmayes Road<br>Ilford, IG3 9UN",
        mapsUrl: 'https://maps.google.com/?q=14+Goodmayes+Road+Ilford+IG3+9UN',
        servicesUrl: 'services.html',
        contactUrl: 'contact.html',
        openingHoursHtml: '<strong>Monday - Saturday:</strong> 9:30am - 8:00pm<br><strong>Sunday:</strong> 9:30am - 6:00pm',
        serviceLines: [
            'Golden Luxury - £45',
            'Golden Bundle - £27',
            'Skin Fade - £15.95',
            'Gents Cut - £13.95',
            'Head Shave - £12.95',
            'Children Under 12 - £8.95',
            'Deluxe Hot Towel Shave - £11',
            'Beard Trim (Machine) - £6.95',
            'Turkish Hot Towel - £3',
            'Ear & Nose Flaming/Waxing - £6',
            'Patterns & Design - £5',
            'Colour - £5',
            'Head Massage - £5',
            'Black or Mud Mask - £5'
        ]
    };

    function pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function normalize(message) {
        return String(message || '').trim().toLowerCase();
    }

    function serviceListHtml() {
        return knowledge.serviceLines.map(function(line) {
            return '&bull; ' + line;
        }).join('<br>');
    }

    var categories = [
        {
            patterns: [/^(hi|hey|hello|hiya|yo|good\s*(morning|afternoon|evening)|alright)\b/i],
            replies: [
                "Hey, I'm Adam. Ask me about services, booking, opening hours, payments, or walk-ins.",
                "Hello. I can help with Golden Barbers services, prices, bookings, and payment info.",
                "Hi there. If you need a service, price, booking route, or opening time, I can point you straight to it."
            ]
        },
        {
            patterns: [/(bye|goodbye|see ya|later|take care|cheers bye)\b/i],
            replies: [
                'Take care. If you need us, call <a href="tel:' + knowledge.phoneHref + '">' + knowledge.phoneDisplay + '</a>.',
                'See you soon. Walk-ins are welcome, and the services page is ready whenever you want to book.',
                'Cheers. If anything comes up, message again or call the shop.'
            ]
        },
        {
            patterns: [/(thank|thanks|cheers|ta|appreciate|thx)\b/i],
            replies: [
                'No problem at all. If you want, I can help with booking or prices next.',
                'You are welcome. Ask if you want service advice, booking help, or shop details.',
                'Happy to help. Let me know if you want the quickest booking route.'
            ]
        },
        {
            patterns: [/(how are you|how's it going|how you doing|you alright|what'?s up)/i],
            replies: [
                "All good here. I'm ready to help with Golden Barbers questions.",
                "Doing well. What do you need, services, booking, payments, or opening hours?",
                "All sorted. Ask me anything about the shop and I'll keep it simple."
            ]
        },
        {
            patterns: [/(service|menu|offer|what do you do|what can you do|available)/i],
            replies: [
                "Here is the current service menu:<br><br>" + serviceListHtml() + "<br><br>For the full breakdown, open <a href=\"" + knowledge.servicesUrl + "\">our services page</a>.",
                "We cover haircuts, skin fades, beard work, hot towel services, and add-ons.<br><br>" + serviceListHtml() + "<br><br>You can view everything on <a href=\"" + knowledge.servicesUrl + "\">the services page</a>."
            ]
        },
        {
            patterns: [/(price|prices|cost|how much|pricing|charge|fee|£|pound)/i],
            replies: [
                "Current prices include Skin Fade at <strong>£15.95</strong>, Gents Cut at <strong>£13.95</strong>, Beard Trim at <strong>£6.95</strong>, Golden Bundle at <strong>£27</strong>, and Golden Luxury at <strong>£45</strong>.<br><br>You can see the full list on <a href=\"" + knowledge.servicesUrl + "\">the services page</a>.",
                "Our prices start from <strong>£3</strong> for add-ons and go up to <strong>£45</strong> for the full Golden Luxury package.<br><br>Open <a href=\"" + knowledge.servicesUrl + "\">services</a> for the full menu."
            ]
        },
        {
            patterns: [/(book|booking|appointment|reserve|schedule|slot)/i],
            replies: [
                "You have two main booking routes.<br><br><strong>Online:</strong> choose your services, add your details, and pay by bank transfer to request the booking. The manager then confirms it.<br><br><strong>WhatsApp:</strong> message us and we will sort the slot with you. Walk-ins are welcome too.",
                "To book online, head to <a href=\"" + knowledge.servicesUrl + "\">services</a>, choose what you want, add your details, and pay by bank transfer before the appointment. If you prefer, you can message the shop on WhatsApp and confirm it that way."
            ]
        },
        {
            patterns: [/(walk\s*in|walk-in|no appointment|just come|show up|queue|wait time)/i],
            replies: [
                "Yes, walk-ins are welcome. In the shop, payment normally happens after the service, by cash or by the QR/bank transfer flow.",
                "Walk-ins are part of the normal flow here. If you just come in, the barber can sort the service first and payment is taken after."
            ]
        },
        {
            patterns: [/(online booking|book online|website booking|pay online)/i],
            replies: [
                "Online bookings are prepaid. You choose the services, enter your booking details, pay by bank transfer, and then the manager confirms the appointment.",
                "If you book through the website, payment happens before the appointment. After that, the booking is reviewed and confirmed by the manager."
            ]
        },
        {
            patterns: [/(open|close|hours|hour|time|when are you|schedule)/i],
            replies: [
                "Our opening hours are:<br><br>" + knowledge.openingHoursHtml + "<br><br>If the live shop status is marked closed or holiday, the website shows that too.",
                "We are open:<br><br>" + knowledge.openingHoursHtml + "<br><br>If you are cutting it close, call <a href=\"tel:" + knowledge.phoneHref + "\">" + knowledge.phoneDisplay + "</a> first."
            ]
        },
        {
            patterns: [/(where|location|address|directions?|map|find you|get there)/i],
            replies: [
                "We are at:<br><br>" + knowledge.locationHtml + "<br><br>That is near Goodmayes Station. <a href=\"" + knowledge.mapsUrl + "\" target=\"_blank\" rel=\"noopener\">Open in Google Maps</a>.",
                "You will find us at:<br><br>" + knowledge.locationHtml + "<br><br>We are close to Goodmayes Station. <a href=\"" + knowledge.mapsUrl + "\" target=\"_blank\" rel=\"noopener\">Get directions</a>."
            ]
        },
        {
            patterns: [/(pay|payment|card|cash|bank transfer|qr|contactless|apple pay|google pay)/i],
            replies: [
                "The payment flow depends on how you visit us.<br><br><strong>Online booking:</strong> bank transfer before the appointment, then manager confirmation.<br><br><strong>In the shop:</strong> payment normally happens after the service, by cash or by our QR/bank transfer flow.",
                "For website bookings, payment is taken in advance by bank transfer. For walk-ins and in-shop visits, the service is done first and payment is usually taken after by cash or QR/bank transfer."
            ]
        },
        {
            patterns: [/(contact|phone|call|number|reach|get in touch|whatsapp)/i],
            replies: [
                "You can reach Golden Barbers on <a href=\"tel:" + knowledge.phoneHref + "\">" + knowledge.phoneDisplay + "</a>.<br><br>For bookings, the website and WhatsApp are the main routes. You can also visit us at " + knowledge.locationHtml + ".",
                "Phone us on <a href=\"tel:" + knowledge.phoneHref + "\">" + knowledge.phoneDisplay + "</a>, or go through <a href=\"" + knowledge.servicesUrl + "\">the services page</a> if you want the website booking flow."
            ]
        },
        {
            patterns: [/(skin\s*fade|fade|taper|blend)/i],
            replies: [
                "Skin fades are one of the shop's strongest services. A full skin fade is <strong>£15.95</strong>, and the barbers can shape it low, mid, or high depending on what suits you.",
                "Fades are a strong point here. If you want a clean modern finish, a skin fade at <strong>£15.95</strong> is one of the main options."
            ]
        },
        {
            patterns: [/(beard|beard trim|facial hair|stubble|goatee|moustache|mustache)/i],
            replies: [
                "For beard work, we offer <strong>Beard Trim (Machine) - £6.95</strong> and <strong>Deluxe Hot Towel Shave - £11</strong>. You can also add a Turkish hot towel for <strong>£3</strong>.",
                "Beard services include trims, shaping, and hot towel options. If you want a simple tidy-up, Beard Trim is <strong>£6.95</strong>."
            ]
        },
        {
            patterns: [/(kid|child|children|son|daughter|boy|young)/i],
            replies: [
                "Children under 12 are <strong>£8.95</strong>. Walk-ins are fine, and if you want a quieter time, weekday mornings are usually easier.",
                "Kids cuts are <strong>£8.95</strong> for under 12s. Bring a reference photo if you want a very specific style."
            ]
        },
        {
            patterns: [/(golden luxury|full package|vip|deluxe package|premium package)/i],
            replies: [
                "Golden Luxury is <strong>£45</strong> and is the premium package. It is the best choice if you want the full grooming treatment instead of just a quick cut.",
                "Golden Luxury is the top package at <strong>£45</strong>. It is aimed at customers who want the full premium experience."
            ]
        },
        {
            patterns: [/(golden bundle|bundle)/i],
            replies: [
                "Golden Bundle is <strong>£27</strong> and is one of the strongest value options on the menu.",
                "Golden Bundle comes in at <strong>£27</strong> and is a good middle ground if you want more than a basic cut."
            ]
        },
        {
            patterns: [/(hair loss|losing hair|thinning|bald|receding)/i],
            replies: [
                "If your hair is thinning, shorter cuts, fades, buzz cuts, or a clean shave usually look stronger than trying to hide it. A barber can be direct with you about what will suit your head shape best.",
                "Hair loss usually looks better when the style works with it instead of fighting it. Short textured cuts, fades, or a head shave are often the cleanest options."
            ]
        },
        {
            patterns: [/(style advice|what should i get|recommend|suggest|what haircut suits me|face shape)/i],
            replies: [
                "The best style depends on face shape, hairline, density, and how much maintenance you want. A fade with texture on top works for a lot of people, but if you want a sharper recommendation, bring a photo and the barber can guide you.",
                "If you want an easy safe option, a clean fade with a tidy textured top works for most men. The best result comes from showing the barber what you like and letting them adjust it to your hair."
            ]
        },
        {
            patterns: [/(hair care|product|wash|shampoo|conditioner|maintain|keep it fresh)/i],
            replies: [
                "A simple routine works best: do not overwash, use decent shampoo, condition when needed, and get regular trims so the shape stays clean.",
                "For most men, the basics are enough: wash properly, avoid harsh products, and get the cut refreshed before it loses shape."
            ]
        },
        {
            patterns: [/(who are you|what are you|are you a bot|are you ai|your name)/i],
            replies: [
                "I'm Adam, Golden Barbers' virtual assistant. I handle shop questions like services, prices, booking routes, payments, and grooming basics.",
                "I'm Adam. I am a rule-based assistant for Golden Barbers, built to answer shop questions clearly and quickly."
            ]
        },
        {
            patterns: [/(what can you do|how can you help|capabilities)/i],
            replies: [
                "I can help with services, prices, booking routes, opening hours, payment rules, location, and general grooming advice.",
                "I am best at Golden Barbers information: what we do, what it costs, how to book, how payments work, and where to find us."
            ]
        },
        {
            patterns: [/(joke|funny|make me laugh)/i],
            replies: [
                "Why do barbers never lose control? Because they know how to keep things tidy.",
                "A barber's favourite shortcut is still the clean one."
            ]
        }
    ];

    var fallbackReplies = [
        "I can help with Golden Barbers services, prices, booking routes, payments, hours, and location. Try asking about one of those.",
        "That is outside my job. Ask me about the shop, grooming, booking, or payments and I will keep it accurate.",
        "I am here for Golden Barbers questions. Services, booking, payments, opening hours, or style advice are the best topics."
    ];

    function getResponse(message) {
        var text = normalize(message);
        if (!text) {
            return 'Ask me about services, booking, payments, opening hours, or walk-ins.';
        }

        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            for (var j = 0; j < category.patterns.length; j++) {
                if (category.patterns[j].test(text)) {
                    return pick(category.replies);
                }
            }
        }

        return pick(fallbackReplies);
    }

    window.GoldenBarbersAdam = {
        knowledge: knowledge,
        getResponse: getResponse
    };
})();
