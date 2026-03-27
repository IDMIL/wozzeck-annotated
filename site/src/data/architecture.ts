export interface SectionAnnotation {
    annotation: string,
    range: [number, number]
}

export interface SceneArchitecture {
    [sceneNumber: number] : {
        scene_name: string,
        annotations: Array<SectionAnnotation>
    }
}

export interface Architecture {
    [actNumber : number] : SceneArchitecture
}

export const architecture : Architecture = {
    1: {
        1: {
            scene_name: "Première Scène: Suite",
            annotations: [
                {"annotation": "Prélude", "range": [1, 29]},
                {"annotation": "Pavane", "range": [30, 50]},
                {"annotation": "Cadenza pour alto seul", "range": [51, 64]},
                {"annotation": "Gigue", "range": [65, 108]},
                {"annotation": "Cadenza pour contrebasson", "range": [109, 114]},
                {"annotation": "Gavotte", "range": [115, 136]},
                {"annotation": "Air", "range": [136, 153]},
                {"annotation": "Reprise", "range": [153, 171]},
                {"annotation": "Rideau", "range": [172, 172]},
                {"annotation": "Interlude orchestral —Changement de scéne", "range": [173, 200]},
            ]
        },
        2: {
            scene_name: "Deuxième Scène: Rhapsodie sur trois accords—Chant de chasseur en trois strophes",
            annotations: [
                {"annotation": "Rhapsodie", "range": [201, 211]},
                {"annotation": "Chant de chasseur — 1ere strophe", "range": [212, 222]},
                {"annotation": "Rhapsodie", "range": [223, 248]},
                {"annotation": "Chant de chasseur — 2ieme strophe", "range": [249, 257]},
                {"annotation": "Rhapsodie et Chant de chasseur — 3ieme strophe", "range": [257, 270]},
                {"annotation": "Rhapsodie", "range": [286, 301]},
                {"annotation": "Interlude orchestral ;", "range": [302, 329]},
                {"annotation": "Rideau", "range": [307, 310]},
                {"annotation": "Changement de scéne", "range": [311, 325]},
                {"annotation": "Approche de la musique militaire", "range": [326, 327]},
                {"annotation": "Levée du rideau", "range": [328, 329]},
            ]
        }
    }
};

/*

PREMIER ACTE

Cing «piéces de caractére»
Prélude m, 1-29
Pavane m. 30-50
Cadenza pour alto seul m, 51-64
Gigue m. 65-108
Cudenza pour contrebasson m, 109-114
Gavotte m. 115-136
Air m. 136-153
Reprise m. 153-171
Rideau m, | 72
Interlude orchestral —Changement de scéne m. 173-200

Rhapsodie m. 201-211
Chant de chasseur—1"" strophe m. 212-222
Rhapsodie m. 223-248
Chant de chasseur — 2°" strophe m. 249-257
Rhapsodie et Chant de chasseur — 3 strophe m, 257-270,
    Rhapsodie m. 286-301
Interlude orchestral ; m, 302-329
Rideau m. 307-310
Changement de scéne m. 341-325
Approche de la musique militaire m, 326-327
Levée du rideau m, 328-329
et
Introduction (Fanfare a la fenétre) m, 330-333
Marche militaire (en vue) m, 334-335 FF]
Quasi-trio m, 346-351
Da capo m, 362-363
Introduction 4 la berceuse m. 363-371
Berceuse — |“ strophe] =| m. 372-387
Berceuse —2™ strophe J— | m. 388-416
Code et transition m, 417-427
Episode Durchkomponiert m, 427-472

Rideau m. 473
Interlude — Changement de scéne m. 473-487
Levée du ridean m, 488

Quatri¢me Scéne : Passacaille

Théme m, 488-495
Variation | m, 496-502
Variation 2 m, 503-509
Variation 3 m, 510-516
Variation 4 m, 517-523
Variation 5 m. 524-530
Variation 6 m. 531-537
Variation 7 m. 538

Variation 8 m. 539-545
Variation 9 m, 546-552
Variation 10 m. 553

Variation |! m. 554-560
Variation |2 m. 561

Variation 13 m, 562-568
Variation 14 m. 569-575
Variation 15 m. 576-582
Variation 16 m. 583-589
Variation |7 m. 590-596,
    Variation 18 m. 597-610
Variation 19 m, 611-619
Variation 20 m. 620-637
Variation 21 m, 638-644
Rideau m. 645-655

Cinguiéme mouvement : Andante affetuoso (quasi-rondo)

Section ! —Changement de scéne m. 636-665
Rideau m. 666

Section 2 m. 666-676
Section 3 m. 677-684
Section 4 m, 685-693
Section 5 m. 693-698
Pause m. 699

Section 6 m. 700-701
Section 7 m. 702-709
Section 8 m, 709-715

Section 9 m. 715-717

(0).
    DEUXIEME ACTE
Symphonie en cing mouvements

Introduction
Exposition

Coda
Premiere reprise
Section principale

Pont
Section secondaire (Théme en Cnioution~]

aa

Développement
Théme principal
Théme de la Coda! =]
Théme du po a
Transition
~ Théme
~ Rideau

+ Strette — Changement de seéne

Section secondaire (Théme en augmentation)
Coda

Cadence finale
Levée du rideau

m. 1-6

m. 7-59

m, 7-28
m. 7-8
m. 7-24
m. 25-28

m, 29-42

m, 43-54
im. 43- 48
m. 49-$4

m, 33-39

m. 60-95

m. 60-80
m. 81-89
m, 90-92
m, 93-95

m. 96-124

m. 96-101
m. bret]
m. 109-12

m, 124-127
m. 128-165

m. 128-149
m. 128-139

m. 140

m. 141-149

m. 150-16]
m. 162-165

m. 166-169
m. 170

102.
Deuxiéme mouvement : Fantaisie et Fugue

Premiére partic m. 171-271
Invention sur les sujets | et I m. 171-202
Valse (Aria) m, 202-247
~ Ritornelle m, 202-207
-Al m, 208-215
~ Rifornelle m, 215-219
-B m, 219-231
~ Ritornella et transition m, 232-238
-AQ m. 238-245
~ Ritornella m, 245-247
Coda m. 248-271
Deuxiéme partic ; Présentation chorale du Sujet MM m. 271-285
Troisiéme partie : Fugue m. 286-345
Exposition du Sujet | m, 286-292
Exposition du Sujet I m. 293-297
Premiére section du Développement (Sujets | ot I) m. 298-312
Exposition du Sujet I m. 313-317
Deuxiéme section du Développement (Sujets | et Ill) m. 317-333
Troisiéme section du Développement (Sujets 1, Tl et Hi) m, 334-341
Coda m. 341-345
Coda m. 345-362
Interlude m. 362-368
Rideau m. 362-365
Changement de scéns m. 366-368
Troisia I
Al (Orchestre de chambre) m. 376-387
Levée du rideau m, 372
B (Orchestre de chambre et Orchestre symphanique) m, 387-397
A2a (Orchestre de chambre) m. 398-402
A2b (Orchestre de chambre et Orchestre Symphonique)} m, 402-406
Interlude et rideau —Changement de scéne m, 406-411

103.
Scherzo | ( Landler)
Al
B

A2

> Levée du rideau

+ Orchestre de I'suberge

    = Transition (Orchestre symphonique)

Trio I (Orchestre symphonique)
Strophe |
2 Strophe

Scherzo Ml (Valse) (Orchestre de 'suberge)
Section |
Section 2
Section 3
Section 4
Section 5
Section 6
Section 7

Trio H
Al ; Checur de chasse
B : Chanson d’ Andres
A2.: Cheeur de chasse

Scherzo | (Quasi-reprise du Landler)
A (Ostinato T)
B

Trio | (Quasi-reprise)
Variation chorale (Orchestre de l’auberge)
Transition
- (Orchestre symphonique)
- (Orchestre de |"auberge)

Scherzo Il (Quasi-reprise de la Valse} (les deux Orchestres) (Ostinato IT)
Rideau rapide
interlude symphonique — Changement de scéne

m, 412-455
m. 412-429
m, 430-438
m. 439-447
m, 439-442
m, 443-447
m, 447-455

m. 456-480
m, 456-464
m. 465-480

m, 481-560
m, 481-495
m, 496-503
m. 504-513
m. 514-528
m, 529-$38
m. §39-545
m, 546-560

m. 561-59!
m. 561-577
m. 577-580
m. 581-591"

ey png
m. 603-604]

m. 605-669
m. 605-633
m. 634-669

m. 634-65
m. 6

m. 671-684
m. 684

m, 685-736

(04.
    Cinquiéme mouvement : Introduction et Rondo

Introduction m. 737-760
(Levée lente du Rideau) m, 740-741
Rondo marziale m. 761-818
A m. 761-768
A | ee
BI m. 776-785
A3 m. 785-788
Cc EJ m. 789-799
B2 m. 800-804
A4 m. 805-814
Silence m. 815-818
Rideau m. 817-818
TROISIEME ACTE
Cing inventions
Silence m. 1-2
(Levée du rideau) m. 1 .
    Premiére seéne : Invention sur un théme
Theme m, 3-9
Variation | m. 10-16
Variation 2 m. 17-18
Variation 3 m, 19-25
Variation 4 m. 26-32
Variation 5 m, 33-39
Variation 6 m, 40-44
Variation 7 m. 45-51
Fugue m, §2-72
Exposition (Sujet !) m, $2-57
Exposition (Sujet Hi) m, 57-62
Strette m, 62-70
~ Rideau lent m. 62-64
~ Changement de scéne m. 64-70
Cadetia (levée du rideau) m, 71-72

    [05
Section | m, 73-76
Section 2 m, 76-80
Section 3 m, 80-85
Section 4 m, 86-92
Section 5 m, 92-96
Section 6 m, 97-108
Rideau m, 108
Interlude—Changement de scene m. 109-121
Troisid nes]
Levée rapide du rideau m..122
Polka (pianino) m. 122-145
Chanson de Wozzeck et reprise de la Polka m, 145-168
Chanson de Margret (piunino) m. 169-179
Canon rythmique m. 180-186
Strette m. 186-212
Rideau rapide m, 211 °
Changement de scéne m. 212-218
Levée du rideau m. 219

Premiére partie m, 220-256
Deuxiéme partie m, 257-284
Troisi¢me partic m, 284-30)
Quatriéme partie m, 301-317
Rideau m, 318-319
Interlude en Ré mineur— Changement de scéne m. 370-37)
Levée du rideau m. 371

: Invention sur un mouvement uel deo m. 372-392

Rideau m. 390-392*/
