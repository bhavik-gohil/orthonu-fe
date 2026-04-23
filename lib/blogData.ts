// Blog data fetched from orthonu.com/resources/blog/
// Product categories: "Oral Relief" | "Tweakz®" | "General"

export type BlogProductCategory = "Oral Relief" | "Tweakz®" | "General";

export interface BlogContentBlock {
    type: "heading" | "paragraph" | "list" | "image" | "video";
    level?: 2 | 3 | 4; // for headings
    text?: string;
    items?: string[]; // for lists
    src?: string; // for images/videos
    alt?: string; // for images
    caption?: string; // for images
    videoId?: string; // for YouTube videos (embedded)
}

export interface Blog {
    slug: string;
    title: string;
    date: string; // ISO format
    excerpt: string;
    thumbnail: string;
    tags: BlogProductCategory[];
    productCategories: BlogProductCategory[];
    content: BlogContentBlock[];
    hasVideo: boolean;
    images: string[]; // all images in the post
}

const YT_PLACEHOLDER = "Xt4X4FvXk2A"; // placeholder YouTube video ID

export const blogs: Blog[] = [
    // ─────────────────────────────────────────────
    // 1. Prevention & Comfort in the Dental Space
    // ─────────────────────────────────────────────
    {
        slug: "prevention-and-comfort-in-orthodontic-care",
        title: "Prevention & Comfort in the Dental Space",
        date: "2025-11-14",
        excerpt:
            "Explore how comfort-driven innovation is reshaping the future of oral health — from Chillin' Strips™ to OrthoChewz™.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2025/11/white-paper-orthonu.webp",
        tags: ["Oral Relief"],
        productCategories: ["Oral Relief"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2024/04/ortho-chewz-with-product.png",
            "https://orthonu.com/wp-content/uploads/2024/11/comfort-tape-product-updated.png",
            "https://orthonu.com/wp-content/uploads/2024/04/chillin-strips-with-product.png",
            "https://orthonu.com/wp-content/uploads/2024/11/mouth-aid-with-product_updated.png",
        ],
        content: [
            {
                type: "paragraph",
                text: "Prevention is the future of oral health, and innovation rooted in empathy is the driving force. At OrthoNu, we believe that every patient deserves comfort throughout their orthodontic journey — not just during appointments, but every single day.",
            },
            {
                type: "heading",
                level: 2,
                text: "Chillin' Strips™: Instant Relief, Reinvented",
            },
            {
                type: "paragraph",
                text: "A modern alternative to dental wax, Chillin' Strips™ provide instant relief from oral irritation caused by braces and appliances. Simply place the strip over the irritating bracket or wire and experience immediate comfort.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2024/04/chillin-strips-with-product.png",
                alt: "Chillin' Strips",
                caption: "Chillin' Strips™ — a modern alternative to dental wax",
            },
            {
                type: "heading",
                level: 2,
                text: "Comfort Tape™: Protection for Sensitive Areas",
            },
            {
                type: "paragraph",
                text: "Comfort Tape™ is specially designed to protect sensitive areas of the mouth and alleviate irritation of inflamed gingiva. Its flexible, latex-free formula conforms to the contours of your mouth for all-day relief.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2024/11/comfort-tape-product-updated.png",
                alt: "Comfort Tape",
                caption: "Comfort Tape™ — protecting sensitive, inflamed areas",
            },
            {
                type: "heading",
                level: 2,
                text: "Mouth-aid™: Fast Relief for Minor Oral Discomfort",
            },
            {
                type: "paragraph",
                text: "Formulated for fast relief of minor oral discomfort, Mouth-aid™ supports the healing of sores and ulcers while soothing inflamed tissue. An essential addition to any patient's at-home care routine.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2024/11/mouth-aid-with-product_updated.png",
                alt: "Mouth-aid",
                caption: "Mouth-aid™ — fast relief for minor oral discomfort",
            },
            {
                type: "heading",
                level: 2,
                text: "OrthoChewz™: Relieve Discomfort, Improve Compliance",
            },
            {
                type: "paragraph",
                text: "OrthoChewz™ is designed to relieve discomfort and improve aligner seating and compliance. By gently chewing on these soft, BPA-free chewies, patients improve aligner fit and reduce soreness during treatment.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2024/04/ortho-chewz-with-product.png",
                alt: "OrthoChewz",
                caption: "OrthoChewz™ — relieve discomfort and improve aligner fit",
            },
            {
                type: "heading",
                level: 2,
                text: "Supporting Your Practice",
            },
            {
                type: "paragraph",
                text: "OrthoNu's Oral Relief Kitz™ and Treatment Starter Kit are professional tools designed to help orthodontic practices offer patients a comprehensive comfort solution from day one of treatment.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 2. Changing the Game for the Industry
    // ─────────────────────────────────────────────
    {
        slug: "changing-the-game-in-orthodontic-care",
        title: "Changing the Game for the Industry with a New Category",
        date: "2025-10-28",
        excerpt:
            "OrthoNu is pioneering a new category of professional-grade oral care that bridges the gap between practice visits and patient comfort.",
        thumbnail: "https://orthonu.com/wp-content/uploads/2025/10/ork-post.jpg",
        tags: ["Oral Relief", "Tweakz®"],
        productCategories: ["Oral Relief", "Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2022/09/tweaks-bundle.png",
            "https://orthonu.com/wp-content/uploads/2022/10/tweakz_for_braces.jpg",
            "https://orthonu.com/wp-content/uploads/2022/11/tweakz_for_aligners.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "The orthodontic industry has long been overdue for innovation that puts the patient's daily experience at the forefront. OrthoNu is doing exactly that — pioneering a new category of professional-grade oral care that goes beyond traditional products.",
            },
            {
                type: "heading",
                level: 2,
                text: "A New Category is Born",
            },
            {
                type: "paragraph",
                text: "For too long, patients have had to rely on general consumer products that were never designed with orthodontic treatment in mind. OrthoNu changes that by offering a curated collection of products that address the specific everyday challenges of life with braces or aligners.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2022/09/tweaks-bundle.png",
                alt: "Tweakz Bundle",
                caption: "The complete Tweakz® collection",
            },
            {
                type: "heading",
                level: 2,
                text: "Bridging the Gap",
            },
            {
                type: "paragraph",
                text: "OrthoNu's dual product lines — Tweakz® and Oral Relief — work together to bridge the gap between office visits and patient comfort at home. The Tweakz® line empowers patients to self-manage minor appliance issues, while the Oral Relief collection soothes discomfort and promotes healing.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2022/10/tweakz_for_braces.jpg",
                alt: "Tweakz for Braces",
                caption: "Tweakz® for Braces — for everyday orthodontic self-care",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2022/11/tweakz_for_aligners.jpg",
                alt: "Tweakz for Aligners",
                caption: "Tweakz® for Aligners — the complete aligner companion",
            },
            {
                type: "paragraph",
                text: "By equipping patients with the right tools, OrthoNu helps reduce unnecessary emergency visits, improves patient satisfaction, and supports better treatment outcomes across the board.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 3. Prevention and Oral Wellness with OrthoNu®
    // ─────────────────────────────────────────────
    {
        slug: "prevention-oral-wellness-orthonu",
        title: "Prevention and Oral Wellness: Building Healthy Smiles That Last",
        date: "2025-09-04",
        excerpt:
            "Oral health is a long-term commitment. Discover how the Tweakz® tool helps patients maintain hygiene and manage minor issues throughout treatment.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2025/09/orthonu-oral-wellness-dental-care-tools.webp",
        tags: ["Tweakz®"],
        productCategories: ["Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2025/09/orthodontic-braces-adjustment-orthonu-tweakz-tool.jpg",
            "https://orthonu.com/wp-content/uploads/2025/09/teen-brushing-braces-oral-hygiene.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "Oral health is not a destination — it's a lifelong journey. And for patients undergoing orthodontic treatment, the path requires extra diligence, the right tools, and a commitment to prevention.",
            },
            {
                type: "heading",
                level: 2,
                text: "Why Prevention Matters During Treatment",
            },
            {
                type: "paragraph",
                text: "Maintaining proper hygiene during orthodontic treatment prevents long-term issues such as decalcification (white spots), gum disease, and enamel erosion. These problems can undermine even the most beautifully aligned smiles.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2025/09/teen-brushing-braces-oral-hygiene.jpg",
                alt: "Teen brushing braces",
                caption: "Good hygiene habits are essential during orthodontic treatment",
            },
            {
                type: "heading",
                level: 2,
                text: "The Tweakz® Tool: A Multi-Functional Companion",
            },
            {
                type: "paragraph",
                text: "The Tweakz® tool is specifically designed to help patients manage small issues at home without an emergency office visit. From smoothing minor aligner edges to pressing back a slightly poking wire, it's the ultimate companion for the modern orthodontic patient.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2025/09/orthodontic-braces-adjustment-orthonu-tweakz-tool.jpg",
                alt: "Tweakz tool adjustment",
                caption: "Tweakz® — empowering patients to manage minor issues at home",
            },
            {
                type: "paragraph",
                text: "By empowering patients with tools that truly work, OrthoNu helps orthodontic practices improve patient satisfaction and reduce the volume of after-hours calls and unscheduled visits.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 4. Back-to-School Guide for Braces & Aligners
    // ─────────────────────────────────────────────
    {
        slug: "back-to-school-braces-aligners-guide",
        title: "Back-to-School Survival Guide for Parents of Kids with Braces and Aligners",
        date: "2025-08-25",
        excerpt:
            "Everything parents need to know to help their kids navigate school with braces or aligners — including must-have items for the backpack.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2025/08/teen-with-backpack.jpg",
        tags: ["Oral Relief"],
        productCategories: ["Oral Relief"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2025/08/teen-with-backpack-1024x683.jpg",
            "https://orthonu.com/wp-content/uploads/2024/04/oral-relief-kitz-2.png",
        ],
        content: [
            {
                type: "paragraph",
                text: "Back-to-school season is exciting — but for parents of kids in orthodontic treatment, it can also bring a new set of worries. What happens if a bracket comes loose at school? What if their aligner case is left at home?",
            },
            {
                type: "heading",
                level: 2,
                text: "Pack a Dental Survival Kit",
            },
            {
                type: "paragraph",
                text: "The most important thing you can do is prepare a dental survival kit to keep in your child's backpack. OrthoNu's Oral Relief Kitz™ is the perfect all-in-one solution — it contains everything a patient might need to manage minor discomfort or appliance issues while away from home.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2024/04/oral-relief-kitz-2.png",
                alt: "Oral Relief Kitz",
                caption: "Oral Relief Kitz™ — the perfect back-to-school companion",
            },
            {
                type: "heading",
                level: 2,
                text: "Must-Have Items for Every Orthodontic Student",
            },
            {
                type: "list",
                items: [
                    "OrthoChewz™ for aligner seating and sore relief",
                    "Chillin' Strips™ for instant bracket irritation relief",
                    "Comfort Tape™ for protecting inflamed gum tissue",
                    "Mouth-aid™ for sores and ulcer relief",
                    "A Tweakz® tool for managing minor aligner or brace issues",
                    "A travel toothbrush and floss picks",
                    "An aligner case (for aligner wearers)",
                ],
            },
            {
                type: "heading",
                level: 2,
                text: "Set Your Child Up for Success",
            },
            {
                type: "paragraph",
                text: "The key is preparation. When children and teens have the right tools on hand, they can handle minor discomforts independently — which builds confidence and reduces the need for parents to rushed to school or orthodontist offices mid-day.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 5. Dr. Sima Yakoby Epstein Inspires at ASCEND
    // ─────────────────────────────────────────────
    {
        slug: "dr-sima-yakoby-epstein-inspires-at-ascend",
        title: "Dr. Sima Yakoby Epstein Inspires at ASCEND, Presented by Women in DSO®",
        date: "2025-08-19",
        excerpt:
            "A recap of Dr. Sima's keynote talk 'A Nu Era in Oral Care Excellence' at the ASCEND conference, where she shared her entrepreneurial journey.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2025/08/sima-video.webp",
        tags: ["General"],
        productCategories: ["Oral Relief"],
        hasVideo: true,
        images: [
            "https://orthonu.com/wp-content/uploads/2025/08/dr-sima-yakoby-epstein-ascend-dykema-orthonu.webp",
            "https://orthonu.com/wp-content/uploads/2025/08/every-journey-begins-with-a-spark-dr-sima-yakoby-epstein.webp",
        ],
        content: [
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2025/08/dr-sima-yakoby-epstein-ascend-dykema-orthonu.webp",
                alt: "Dr. Sima at ASCEND",
                caption: "Dr. Sima Yakoby Epstein speaking at ASCEND, presented by Women in DSO®",
            },
            {
                type: "paragraph",
                text: "At the ASCEND conference presented by Women in DSO®, Dr. Sima Yakoby Epstein took the stage with a powerful talk titled 'A Nu Era in Oral Care Excellence.' Her message resonated deeply with the hundreds of dental and orthodontic professionals in attendance.",
            },
            {
                type: "heading",
                level: 2,
                text: "A Journey of Innovation with Empathy",
            },
            {
                type: "paragraph",
                text: "Dr. Sima shared her personal journey from orthodontist to entrepreneur — a path fueled not by ambition alone, but by a genuine desire to solve the unmet needs of her own patients. She described witnessing patients in discomfort between appointments and feeling compelled to create something better.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2025/08/every-journey-begins-with-a-spark-dr-sima-yakoby-epstein.webp",
                alt: "Every journey begins with a spark",
                caption: "\"Every journey begins with a spark\" — Dr. Sima Yakoby Epstein",
            },
            {
                type: "heading",
                level: 2,
                text: "Watch the Keynote",
            },
            {
                type: "video",
                videoId: YT_PLACEHOLDER,
                caption: "Dr. Sima Yakoby Epstein's keynote at ASCEND (Full talk — coming soon)",
            },
            {
                type: "paragraph",
                text: "The talk inspired professionals across the industry to think differently about the patient experience — and to see comfort not as a luxury, but as a clinical imperative. OrthoNu's product line was born from this vision, and ASCEND was the perfect stage to share it with the world.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 6. Get ready for great newz!
    // ─────────────────────────────────────────────
    {
        slug: "get-ready-for-great-newz",
        title: "Get ready for great newz!",
        date: "2024-05-02",
        excerpt:
            "Something exciting is on the horizon at OrthoNu. Stay tuned for a major announcement from the team!",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2023/01/OrthoNu_logo.jpg",
        tags: ["General"],
        productCategories: ["Oral Relief", "Tweakz®"],
        hasVideo: false,
        images: ["https://orthonu.com/wp-content/uploads/2023/01/OrthoNu_logo.jpg"],
        content: [
            {
                type: "paragraph",
                text: "We have been busy behind the scenes at OrthoNu, and we can barely contain our excitement. Something big is coming — something that will change the way patients experience orthodontic care.",
            },
            {
                type: "paragraph",
                text: "We can't share all the details just yet, but we promise it will be worth the wait. Follow us on social media and sign up for our newsletter to be the first to know.",
            },
            {
                type: "paragraph",
                text: "Thank you for being part of the OrthoNu journey. The best is truly yet to come!",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 7. The 411 on 911s in Orthodontic Treatment
    // ─────────────────────────────────────────────
    {
        slug: "the-411-on-911s-in-orthodontic-treatments",
        title: "The 411 on 911s in Orthodontic Treatments",
        date: "2023-09-29",
        excerpt:
            "Dr. Sima Yakoby Epstein's feature in the Oral Health journal explores orthodontic emergencies, the oral microbiome, and empowering patients to handle minor issues.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2023/09/pokey-wire-resized.jpg",
        tags: ["Tweakz®", "Oral Relief"],
        productCategories: ["Tweakz®", "Oral Relief"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2022/08/Dr.-Sima-Yakoby-Epstein-DMD-300x300.jpg",
            "https://orthonu.com/wp-content/uploads/2023/09/pokey-wire-resized.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "Orthodontic emergencies are an unavoidable part of treatment — but they don't have to derail a patient's day or clog up a practice's schedule. In a recent byliner published in the Oral Health journal, Dr. Sima Yakoby Epstein outlines how the right tools and patient education can make all the difference.",
            },
            {
                type: "heading",
                level: 2,
                text: "The Oral Microbiome During Treatment",
            },
            {
                type: "paragraph",
                text: "Braces and aligners create new environments in the mouth that can disrupt the oral microbiome. Brackets trap food particles, and aligners can trap bacteria against teeth if hygiene habits are not maintained. Understanding this helps patients make smarter choices every day.",
            },
            {
                type: "heading",
                level: 2,
                text: "Empower Patients, Improve Efficiencies",
            },
            {
                type: "paragraph",
                text: "When patients are educated and equipped to handle minor orthodontic issues at home, it dramatically reduces the volume of emergency calls and walk-in visits. Products like the Tweakz® tool and the Oral Relief collection are designed precisely for this purpose.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2022/08/Dr.-Sima-Yakoby-Epstein-DMD-300x300.jpg",
                alt: "Dr. Sima Yakoby Epstein",
                caption: "Dr. Sima Yakoby Epstein, DMD — OrthoNu Founder",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 8. Back-to-School Guide: Mastering Dental Care
    // ─────────────────────────────────────────────
    {
        slug: "back-to-school-guide-mastering-dental-care",
        title: "Back-to-School Guide: Mastering Dental Care for You and Your Kids",
        date: "2023-08-30",
        excerpt:
            "Ten practical tips for maintaining excellent oral hygiene during the school year, for kids of all ages in and out of orthodontic treatment.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2023/08/Back-to-School-Guide-Mastering-Dental-Care-for-You-and-Your-Kids.jpg",
        tags: ["Tweakz®"],
        productCategories: ["Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2023/08/Back-to-School-Guide-Mastering-Dental-Care-for-You-and-Your-Kids.jpg",
            "https://orthonu.com/wp-content/uploads/2025/08/teen-with-backpack.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "The back-to-school rush is the perfect time to reset healthy habits — including dental care routines. Here are ten tips to help your family maintain great oral hygiene throughout the school year.",
            },
            {
                type: "heading",
                level: 2,
                text: "10 Tips for a Great Dental School Year",
            },
            {
                type: "list",
                items: [
                    "Brush twice daily — morning and before bed — for two full minutes.",
                    "Floss at least once a day, paying special attention around brackets and wires.",
                    "Choose tooth-friendly snacks: fresh fruits, vegetables, cheese, and nuts.",
                    "Stay hydrated — water naturally rinses away food particles and bacteria.",
                    "Pack a travel dental kit in your backpack or locker.",
                    "Wear a mouthguard during sports to protect teeth and orthodontic appliances.",
                    "Use Tweakz® for minor wire or bracket issues rather than waiting for an appointment.",
                    "Limit sugary drinks and acidic beverages that weaken enamel.",
                    "Keep all scheduled orthodontic appointments — don't skip or reschedule.",
                    "Replace your toothbrush every 3 months or after illness.",
                ],
            },
            {
                type: "paragraph",
                text: "Small daily habits add up to big long-term results. Start the school year with a commitment to your smile!",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 9. Staying Committed to Your Aligners
    // ─────────────────────────────────────────────
    {
        slug: "staying-committed-to-your-aligners",
        title: "Staying Committed to Your Aligners: Key Tips for Successful Treatment",
        date: "2023-07-30",
        excerpt:
            "Maximizing aligner effectiveness requires discipline and the right habits. Here's expert advice on staying on track with your clear aligner treatment.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2023/07/Staying-Committed-to-Your-Aligners.jpg",
        tags: ["Tweakz®"],
        productCategories: ["Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2023/07/Staying-Committed-to-Your-Aligners.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "Clear aligner treatment is one of the most exciting innovations in modern orthodontics — but only if patients wear them consistently. The secret to a successful outcome lies not just in the aligners themselves, but in the habits patients build around them.",
            },
            {
                type: "heading",
                level: 2,
                text: "Wear Them for 22 Hours a Day",
            },
            {
                type: "paragraph",
                text: "The most important rule: wear your aligners for at least 22 hours daily. The only times they should come out are for eating, drinking (anything other than water), and brushing your teeth.",
            },
            {
                type: "heading",
                level: 2,
                text: "Always Remove Before Eating",
            },
            {
                type: "paragraph",
                text: "Never eat with your aligners in. Food particles trapped under aligners create the perfect environment for bacteria and can stain or warp your trays. Always have your case on hand.",
            },
            {
                type: "heading",
                level: 2,
                text: "Brush After Every Meal",
            },
            {
                type: "paragraph",
                text: "Before reinserting your aligners, brush your teeth. Replacing aligners over unbrushed teeth traps bacteria and increases the risk of cavities and bad breath.",
            },
            {
                type: "heading",
                level: 2,
                text: "Smooth Any Rough Edges with Tweakz®",
            },
            {
                type: "paragraph",
                text: "If the edge of a tray feels sharp or is causing irritation, use the Tweakz® for Aligners tool to gently smooth it down. This can save you from unnecessary discomfort and keep your wear time on track.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 10. Embracing a Nu Smile: My Journey
    // ─────────────────────────────────────────────
    {
        slug: "embracing-a-nu-smile",
        title: "Embracing a Nu Smile: My Journey with Aligners & Tweakz®",
        date: "2023-06-26",
        excerpt:
            "Tina shares her 50-week aligner journey — the challenges, triumphs, and how Tweakz® became an indispensable part of her treatment.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2023/06/My-Journey-with-Aligners-Tweakz.jpg",
        tags: ["Tweakz®"],
        productCategories: ["Tweakz®"],
        hasVideo: true,
        images: [
            "https://orthonu.com/wp-content/uploads/2023/06/Tina-Before.jpg",
            "https://orthonu.com/wp-content/uploads/2023/06/Tina-After.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "My name is Tina, and I want to share my 50-week aligner journey — including how Tweakz® became one of the most important tools in my orthodontic toolkit.",
            },
            {
                type: "heading",
                level: 2,
                text: "The Beginning: A Big Decision",
            },
            {
                type: "paragraph",
                text: "When I decided to start aligner treatment as an adult, I was both excited and nervous. I'd spent years self-conscious about my smile, and the idea of fixing it without the metal brackets of traditional braces was incredibly appealing.",
            },
            {
                type: "heading",
                level: 2,
                text: "The Adjustment Period",
            },
            {
                type: "paragraph",
                text: "The first few weeks were a real adjustment. My speech was slightly affected, and removing the aligners without pinching them was a learning curve. That's when I discovered the Tweakz® for Aligners — a touch-free aligner remover that made removal effortless and sanitary.",
            },
            {
                type: "heading",
                level: 2,
                text: "Watch My Journey",
            },
            {
                type: "video",
                videoId: "_vVtvF828eA",
                caption: "Tina's aligner journey with Tweakz® — watch her transformation",
            },
            {
                type: "heading",
                level: 2,
                text: "My Before & After",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2023/06/Tina-Before.jpg",
                alt: "Tina before aligners",
                caption: "Before: Week 1 of aligner treatment",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2023/06/Tina-After.jpg",
                alt: "Tina after aligners",
                caption: "After: 50 weeks later — the results speak for themselves",
            },
            {
                type: "paragraph",
                text: "Looking back, I can honestly say that having the right products made my treatment so much more manageable. Tweakz® wasn't just a tool — it was a confidence booster that made me feel in control of my own treatment.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 11. Navigating the Summer Rush
    // ─────────────────────────────────────────────
    {
        slug: "navigating-the-summer-rush",
        title: "Navigating the Summer Rush: Tips for Orthodontists and Patients",
        date: "2023-05-21",
        excerpt:
            "Summer brings a seasonal surge of new orthodontic patients. Here's how practices and patients alike can prepare for the rush — and stay comfortable.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2023/05/Navigating-the-Summer-Rush-Tips-for-Orthodontists-and-Patients.jpg",
        tags: ["Tweakz®"],
        productCategories: ["Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2023/05/Navigating-the-Summer-Rush-Tips-for-Orthodontists-and-Patients.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "Every summer, orthodontic practices experience a significant influx of new patients — families taking advantage of school breaks to start treatment. This seasonal rush brings both opportunity and challenge.",
            },
            {
                type: "heading",
                level: 2,
                text: "For Practices: Managing the Surge",
            },
            {
                type: "paragraph",
                text: "The key to managing a summer surge is preparation. Consider extending hours, training additional staff, and creating systems that allow the practice to onboard new patients efficiently without compromising care quality.",
            },
            {
                type: "heading",
                level: 2,
                text: "For Patients: Staying Safe at Camp and on Vacation",
            },
            {
                type: "paragraph",
                text: "Summer also means camp, sports, and travel — all situations where access to an orthodontist may be limited. Sending kids off with the right tools, including the Tweakz® tool, can prevent minor issues from becoming major problems.",
            },
            {
                type: "heading",
                level: 2,
                text: "The Role of Self-Care Products",
            },
            {
                type: "paragraph",
                text: "Products like Tweakz® for Braces and Tweakz® for Aligners are essential summer companions. They empower patients to manage minor appliance issues independently — reducing emergency calls and giving parents peace of mind while their kids are away.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 12. Raising Awareness of Oral Cancer
    // ─────────────────────────────────────────────
    {
        slug: "raising-awareness-of-oral-cancer",
        title: "Raising Awareness of Oral Cancer",
        date: "2023-04-27",
        excerpt:
            "April is Oral Cancer Awareness Month. Here's how to self-screen for oral cancer — and why early detection saves lives.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2023/04/Orthonu_raising_awareness_of_oral_cancer-1.jpg",
        tags: ["General"],
        productCategories: ["Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2023/04/Orthonu_raising_awareness_of_oral_cancer-1.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "April is Oral Cancer Awareness Month — and at OrthoNu, we're committed to using our platform to spread this life-saving message.",
            },
            {
                type: "heading",
                level: 2,
                text: "The Statistics Are Sobering",
            },
            {
                type: "paragraph",
                text: "According to the Oral Cancer Foundation, approximately 54,000 people in the United States are diagnosed with oral cancer each year. When detected early, the 5-year survival rate exceeds 80%. Yet many cases aren't caught until a late stage.",
            },
            {
                type: "heading",
                level: 2,
                text: "Five Steps to Self-Screen for Oral Cancer",
            },
            {
                type: "list",
                items: [
                    "Check your mouth: Look for red or white patches, sores, or unusual growths in front of a mirror.",
                    "Observe your speech: Note any persistent hoarseness, difficulty swallowing, or changes in voice.",
                    "Feel for lumps: Gently feel around your neck, jaw, and cheeks for any unusual lumps or swelling.",
                    "Check your teeth and gums: Look for changes in bite, loose teeth, or unexplained bleeding gums.",
                    "Pay attention to pain: Report any persistent pain or numbness in the mouth, face, or neck to your dentist.",
                ],
            },
            {
                type: "paragraph",
                text: "Regular dental checkups are the most important step you can take. Your dentist and orthodontist are often the first to spot early signs of oral cancer — another reason those appointments matter so much.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 13. Three Bright Minds Making Us Smile
    // ─────────────────────────────────────────────
    {
        slug: "three-bright-minds-making-us-smile",
        title: "Three Bright Minds Making Us Smile",
        date: "2023-04-16",
        excerpt:
            "On National Inventors' Day, we celebrate three extraordinary women who changed the world through creativity, courage, and vision.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2023/02/OrthoNu_Three-Bright-Minds-Making-Us-Smile.jpg",
        tags: ["General"],
        productCategories: ["Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2023/02/OrthoNu_Three-Bright-Minds-Making-Us-Smile.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "National Inventors' Day is a celebration of creativity, courage, and the human drive to make the world a better place. Today, we honor three extraordinary women whose inventions — in the broadest sense of the word — have made us smile.",
            },
            {
                type: "heading",
                level: 2,
                text: "Coco Chanel: Redefining Fashion",
            },
            {
                type: "paragraph",
                text: "Coco Chanel didn't just design clothes — she liberated women from corsets and pearls, creating a timeless aesthetic built on comfort, elegance, and confidence. Her invention was a new standard of how women could present themselves to the world.",
            },
            {
                type: "heading",
                level: 2,
                text: "Beyoncé Knowles: Innovating Music",
            },
            {
                type: "paragraph",
                text: "Beyoncé's 2013 surprise visual album fundamentally changed the music industry. By pairing every song with a film, she invented a new format for music releases and demonstrated a model of creative control that artists still aspire to today.",
            },
            {
                type: "heading",
                level: 2,
                text: "Oprah Winfrey: Breaking Barriers in Media",
            },
            {
                type: "paragraph",
                text: "Oprah Winfrey invented a new kind of television — one built on empathy, vulnerability, and personal responsibility. In doing so, she created a media empire that has touched billions of lives and opened doors for countless others.",
            },
            {
                type: "paragraph",
                text: "At OrthoNu, we're inspired by innovators like these every day. They remind us that the most powerful inventions come from a deep understanding of human need — and the courage to act on it.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 14. The Magic of Beginnings: Happy New Year
    // ─────────────────────────────────────────────
    {
        slug: "the-magic-of-beginnings-happy-new-year",
        title: "The Magic of Beginnings: Happy New Year from OrthoNu",
        date: "2023-01-17",
        excerpt:
            "Dr. Sima reflects on the OrthoNu journey and shares a list of orthodontist-approved New Year gift ideas — including Tweakz®.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2023/01/Happy-New-Year-from-OrthoNu.jpg",
        tags: ["Tweakz®"],
        productCategories: ["Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2023/01/Happy-New-Year-from-OrthoNu.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "There is something magical about new beginnings. The start of a new year is an invitation to dream bigger, love deeper, and commit to the things that truly matter. From all of us at OrthoNu, we wish you a year full of bright smiles and new horizons.",
            },
            {
                type: "heading",
                level: 2,
                text: "OrthoNu-Approved New Year Gift Ideas",
            },
            {
                type: "paragraph",
                text: "Looking for thoughtful gift ideas for the smile-conscious people in your life? Here are a few orthodontist-approved picks that are sure to bring joy:",
            },
            {
                type: "list",
                items: [
                    "Lip Balm & Scrub — for soft, healthy lips throughout the year",
                    "Truffle Oil — because good taste is always worth investing in",
                    "Indoor Plants — to bring calm and fresh air to any space",
                    "The Gift of Giving — donate to a cause that improves oral health access",
                    "Tweakz® — the ultimate gift for anyone in orthodontic treatment",
                ],
            },
            {
                type: "paragraph",
                text: "As we welcome 2023, the OrthoNu team is more committed than ever to our mission: transforming the standard of care for orthodontic patients everywhere. Thank you for being part of our story.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 15. What's Nu: Setting the Stage for a New Era
    // ─────────────────────────────────────────────
    {
        slug: "whats-nu-setting-the-stage-for-a-new-era",
        title: "What's Nu: Setting the Stage for a New Era in Orthodontics",
        date: "2023-01-17",
        excerpt:
            "Dr. Sima shares key takeaways from the OrthoPreneurs Summit — and what the future of orthodontic care looks like through the lens of technology and self-care.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2022/11/Sima-Image-for-Blog-post.jpg",
        tags: ["Tweakz®"],
        productCategories: ["Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2022/11/OrthoPreneurs_2022.jpg",
            "https://orthonu.com/wp-content/uploads/2022/11/Sima-Image-for-Blog-post.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "The OrthoPreneurs (OP) Summit is one of the most forward-thinking gatherings in the orthodontic industry. This year, attending it reminded me of just how rapidly our field is changing — and how important it is for practices to stay ahead of the curve.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2022/11/OrthoPreneurs_2022.jpg",
                alt: "OrthoPreneurs Summit 2022",
                caption: "The OrthoPreneurs Summit — a hotbed of orthodontic innovation",
            },
            {
                type: "heading",
                level: 2,
                text: "The Three Trends Shaping Orthodontics",
            },
            {
                type: "paragraph",
                text: "Three themes dominated conversations at OP Summit this year: rising patient demand, technology breakthroughs, and the growing importance of patient self-care.",
            },
            {
                type: "heading",
                level: 2,
                text: "Rising Patient Demand",
            },
            {
                type: "paragraph",
                text: "The pandemic created a \"smile consciousness\" boom — more adults than ever are seeking orthodontic treatment. Practices that can handle volume without sacrificing quality will thrive in the years ahead.",
            },
            {
                type: "heading",
                level: 2,
                text: "Technology Breakthroughs",
            },
            {
                type: "paragraph",
                text: "AI-driven treatment planning, 3D imaging, and intraoral scanning are no longer the future — they're the present. Practices that haven't embraced digital workflows need to act fast.",
            },
            {
                type: "heading",
                level: 2,
                text: "The Rise of Telehealth and Self-Care",
            },
            {
                type: "paragraph",
                text: "Patients want more control over their own health journeys. Telehealth monitoring and self-care solutions like Tweakz® are meeting that demand — enabling better compliance, fewer emergency visits, and improved outcomes.",
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 16. Bracing for What's Next in Orthodontics
    // ─────────────────────────────────────────────
    {
        slug: "bracing-for-whats-next-in-orthodontics",
        title: "Bracing for What's Next in Orthodontics",
        date: "2023-01-17",
        excerpt:
            "An in-depth look at OrthoNu's founding mission, Dr. Sima's personal story, and the growing $16B global orthodontic market.",
        thumbnail:
            "https://orthonu.com/wp-content/uploads/2022/08/sima-office-yellow-3-copy-scaled.jpg",
        tags: ["Tweakz®"],
        productCategories: ["Tweakz®"],
        hasVideo: false,
        images: [
            "https://orthonu.com/wp-content/uploads/2022/08/sima-office-yellow-3-copy-1024x1024.jpg",
        ],
        content: [
            {
                type: "paragraph",
                text: "Every great product is born from a personal story. At OrthoNu, ours begins with Dr. Sima Yakoby Epstein's own experience as both a patient and a practitioner.",
            },
            {
                type: "image",
                src: "https://orthonu.com/wp-content/uploads/2022/08/sima-office-yellow-3-copy-1024x1024.jpg",
                alt: "Dr. Sima in her office",
                caption: "Dr. Sima Yakoby Epstein — orthodontist, entrepreneur, innovator",
            },
            {
                type: "heading",
                level: 2,
                text: "A Story That Started with a Car Accident",
            },
            {
                type: "paragraph",
                text: "As a child, Dr. Sima was involved in a car accident that required extensive dental work. That experience planted a seed — a deep respect for the transformative power of oral health care. Years later, it would inspire her to found OrthoNu.",
            },
            {
                type: "heading",
                level: 2,
                text: "A $16 Billion Opportunity",
            },
            {
                type: "paragraph",
                text: "The global orthodontic market is valued at over $16 billion and continues to grow. Yet until OrthoNu, there was no category of professional-grade at-home care products specifically designed for patients in treatment. We set out to fill that gap.",
            },
            {
                type: "heading",
                level: 2,
                text: "Scientific Validation",
            },
            {
                type: "paragraph",
                text: "OrthoNu's products are developed in partnership with the University of Pennsylvania's Center for Innovation & Precision Dentistry (CiPD) — ensuring that every product meets the highest standards of safety, efficacy, and clinical relevance.",
            },
            {
                type: "paragraph",
                text: "The future of orthodontic care is preventive, patient-empowered, and precision-driven. OrthoNu is bracing for what's next — and we'd love for you to join us.",
            },
        ],
    },
];

// Helper to get blog by slug
export function getBlogBySlug(slug: string): Blog | undefined {
    return blogs.find((b) => b.slug === slug);
}

// Helper to get related blogs (same product category, excluding current)
export function getRelatedBlogs(current: Blog, count = 3): Blog[] {
    const related = blogs.filter(
        (b) =>
            b.slug !== current.slug &&
            b.productCategories.some((cat) => current.productCategories.includes(cat))
    );
    if (related.length >= count) return related.slice(0, count);
    // Fill with other blogs if not enough related ones
    const others = blogs.filter(
        (b) => b.slug !== current.slug && !related.includes(b)
    );
    return [...related, ...others].slice(0, count);
}
