C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffprobe.exe -v quiet -print_format json -show_format -show_streams C:\Diana\2022_Diana\CreatingWebsites\media\BowAndPresentation.mp4 > BowAndPresentationInfo.json

C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffprobe.exe -i C:/Diana/2022_Diana/CreatingWebsites/ffmpegPlayer/uploads/cat.mp4 -v quiet -print_format json -show_entries stream=width,height -hide_banner > output.txt

C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffmpeg.exe  -i C:/Diana/2022_Diana/CreatingWebsites/media/Bow1.mp4  -c copy .\OutputFiles\Bow1.ts
C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffmpeg.exe  -i C:/Diana/2022_Diana/CreatingWebsites/media/1_DMajorScale_and_BachMusette.mp4  -c copy .\OutputFiles\1_DMajorScale_and_BachMusette.ts
echo file '.\OutputFiles\Bow1.ts' > resultfile.txt
echo file '.\OutputFiles\1_DMajorScale_and_BachMusette.ts'  >> resultfile.txt
C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffmpeg.exe -f concat -safe 0 -i resultfile.txt -c copy .\OutputFiles\output.mp4
 rem C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffmpeg.exe  -i C:/Diana/2022_Diana/Piano/2022PianoCertifiedAwards/OriginalInputSongs/Bow1.mp4 -vf "drawtext=text='  ':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=1600:" .\Bow1Annotated.mp4

 rem C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffmpeg.exe  -i C:/Diana/2022_Diana/Piano/2022PianoCertifiedAwards/OriginalInputSongs/2_GMinorScale_and_BachMinuetInGMinor.mp4 -vf "drawtext=text=' Minuet in G Minor, ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=540:enable='gte(t,17)',drawtext=text=' BWV Anh. 115 ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=570:enable='gte(t,17)', drawtext=text=' by Johann Sebastian Bach ':fontcolor=white:fontsize=20:x=(w-text_w)/2:y=600:enable='gte(t,17)'" .\2_GMinorScale_and_BachMinuetInGMinorAnnotated.mp4
