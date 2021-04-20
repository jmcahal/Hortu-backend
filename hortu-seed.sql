INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ( 'testuser',
            'password',
            'Test',
            'User',
            'test@mail.com',
            FALSE),
        ( 'testadmin',
            'password',
            'Test',
            'Admin',
            'admin@mail.com',
            TRUE);

INSERT INTO plants (common_name,
                    sci_name,
                    seed_specs,
                    transplant,
                    culture,
                    germination,
                    disease_pests,
                    harvest,
                    life_cycle,
                    spacing,
                    height,
                    light_soil_requirements,
                    plant_use,
                    growing_tips)
VALUES ('Tomatoes', 'Solanum lycopersicum', 
        'Seeds/oz (varies): Avg. 13,400 Avg. Planting Rate: 785 seeds to produce 667 plants needed to plant 1,000ft row.',
        'Avg. 33 plants/pkt, 850 plants/1,000 seeds',
        'Transplant (recommended) - Sow 1/4" deep in flats or cold frams about 5-6 weeks before plants can be set out, after frost danger. 
            Keep soil temp 75-90°F/ 24-32°C until emergence. When the ture leaves are emerging, transplant into pots or cell-type containers, 
            or 2-3" apart flats. Grow seedlings at 60-70°F/16-21°C. Water only enough to keep mix from drying. Fertilize moderately with fish 
            emulsion or a balanced soulable fertilizer. To harden seedlings reduce water and temperature for a week before transplanting outdoors.  
            Once the soil is thoroughly warm, a mulch may be applied. Direct seed - Extra-early varieties may be direct seeded outdoors around 
            last frost date.',
        NULL, 
        'All varieties (unless otherwise noted in catalog) are susceptible to early blight, particularly the early determinate ones. To reduce blight, 
            keep seedlings healthy and growing steadily before transplanting out and use containers of sufficient size so that the plants do not become 
            root bound. We also encourage trialing of our blight tolerant varieties. Discourage disease with crop rotation and good sanitation.',
        'Harvest ripe fruits regularly.',
        NULL,
        'Transplant after frost danger 18-24" apart for determinates, 24-36" for unstaked indeterminates, and 18-24" for staked plants.',
        NULL,
        'Abundant soil phosphorus is important for high yields. Excess nitrogen causes rampant growht and soft, late-ripening fruits.',
        'Grown for produce.',
        'Determinate varieties may be pruned and supported with cages, stakes, or basket-weave; indeterminate varieities should be pruned and 
            trellised for high-quality yileds. For earlier crops in cool regions create extra warmth with infrared transmitting poly mulch and 
            row covers.'
        ),
        ('Snapdragon', 'Antirrhinum majus',
        NULL,
        'Surface sow 8-10 weeks before last frost. Light is required for germination, but a fine layer of vermiculite covering the seed will help 
            maintian moisture levels and prevent algae growth. Bottom water or mist lightly to avoid covering seed. Transplant to packs or larger 
            containers when true leaves appear, approx. 3-4 weeks after sowing. Harden off and transplant out after danger of frost has passed.',
        'Direct seeding is not recommended.',
        '7-14 days at 70-75°F/21-24°C day.',
        NULL,
        'Fresh - Florets on lower 1/3-1/2 of spike are open.',
        'Annual',
        '4-12" apart.',
        NULL,
        'sun to part shade in rich, well-drained, moist soil. pH Neutral is preferred.',
        'Cut flower. Edible flower.',
        'After seedlings have 3-5 true leaves, grow at 50-55°F/10-13°C nights and 60°F/16°C days. Pinch back to 1 1/2-2" when seedlings are about 3-4" 
            tall to encourage branching.');
            
INSERT INTO posts (username,
                    plant_id,
                    title, 
                    post_body)
VALUES ('testuser', 1, 'Homegrown Tomatoes 2021', 'Planting my tomotoes today. check out the pics!!');

INSERT INTO photos (title, 
                    description,
                    img,
                    username,
                    plant_id,
                    post_id)
VALUES ('Tomatoes', 'Garden Tomoatoes', NULL, 'testuser', 1,1),
        ('Snapdragon', 'Orange Snapdragon', NULL, 'testuser', 2, NULL);


