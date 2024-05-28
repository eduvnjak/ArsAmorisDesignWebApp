#!/bin/bash

# Array of filenames
filenames=(
"test6-ootg2syxb1a.jpg"
"test8-prfhrncyezx.jpg"
"test6-3ax1rarufdt.jpg"
"test5-wwofxym3vl4.jpg"
"test2-am45fe54azo.jpg"
"test7-wl3jpkdkdsm.jpg"
"test6-w5cfjmqjuw2.jpg"
"test6-ddsh4w0zfl5.jpg"
"test2-uinncxur2wg.jpg"
"test4-4cme3hxsmmq.jpg"
"test2-eextxnvdyfe.jpg"
"test3-g4usyvrd5b3.jpg"
"test4-rqrdq2f44ve.jpg"
"test10-f1fkducp5it.jpg"
"test4-zrmcbo2q1te.jpg"
"test8-r40lmd044ke.jpg"
"test10-5bj2tz5o2gt.jpg"
"test2-mrhlfl5sprz.jpg"
"test9-jz4v3it3imn.jpg"
"test7-x2gpcu2wy53.jpg"
"test4-pg5b20jpahq.jpg"
"test3-aqtuypjkjjp.jpg"
"test3-zfcqswxpwdg.jpg"
"test9-dvkbnthv3nt.jpg"
"test10-4fmscla2nfm.jpg"
"test4-r4earlutju5.jpg"
"test5-0qcobrfu05i.jpg"
"test3-ptqzghyk01m.jpg"
"test8-alnbkecbieu.jpg"
"test10-gpdjitkazrv.jpg"
"test8-gri0dvoctth.jpg"
"test4-5jgwxw5gpjo.jpg"
"test4-ncg2j0w5wcl.jpg"
"test7-rxhn13nfkyc.jpg"
"test6-5sx4crkig3u.jpg"
"test2-rrfskayc12p.jpg"
"test5-t0bfywrvzyc.jpg"
"test10-5yk0nbzdmxe.jpg"
"test10-vwhqbgkcssy.jpg"
"test5-ogz2cmox3iz.jpg"
"test8-i1cn0nprexh.jpg"
"test7-q4pcw1ubpsb.jpg"
"test2-oc0ndre0pos.jpg"
"test4-njitf3v0gen.jpg"
"test3-tdajm33mrok.jpg"
"test6-te53zt0n0hd.jpg"
"test9-zlduf0gbi3f.jpg"
"test8-usgwpzrrz1b.jpg"
"test7-pyzqqfja4vf.jpg"
"test3-lfbzih3hc0j.jpg"
"test10-ezcrlfwpmvd.jpg"
"test1-wun3iqudrec.jpg"
"test9-tvl51ifwyeq.jpg"
"test5-5cfnrw3qut5.jpg"
"test3-vj3y15103x2.jpg"
"test9-bueyuewoie0.jpg"
"test7-3xphn3mcqir.jpg"
"test6-3x4lesid4hd.jpg"
"test1-3kmxzzqjfsc.jpg"
"test7-z3kx0venvua.jpg"
"test4-0ansqw1ogni.jpg"
"test4-bfgmdhqsqln.jpg"
"test7-on5mh0jjoen.jpg"
"test9-i4gpfw5gik1.jpg"
"test1-mwrgvu0n5sf.jpg"
"test10-kxb3ufnubs5.jpg"
"test2-xoiimstlok4.jpg"
"test9-o4c2ka3pf0d.jpg"
"test3-fiji2z243ng.jpg"
"test8-cvk4sygn0t0.jpg"
"test8-ywqg4bs55zf.jpg"
"test10-qzk5dyl4ze2.jpg"
"test8-x4s0xorwfmi.jpg"
"test2-xj13prhsi2g.jpg"
"test3-ktnuanhzer5.jpg"
"test10-j4lkufzlb2b.jpg"
"test4-3wx0zgprbtm.jpg"
"test6-c3qdlpu21hs.jpg"
"test7-vn0is1fcerx.jpg"
"test9-3sezvx53lgp.jpg")

# Directory containing source images
source_dir="source_images"

# Directory to copy renamed images to
target_dir="target_directory"

# Get the list of images from the source directory
images=("$source_dir"/*)

# Iterate over the filenames array
for filename in "${filenames[@]}"; do
    # Select a random image from the source directory
    random_image="${images[RANDOM % ${#images[@]}]}"
    
    # Copy the random image and rename it
    cp "$random_image" "$target_dir/$filename"
    
    echo "Copied $random_image to $target_dir/$filename"
done

echo "All files have been copied and renamed."
