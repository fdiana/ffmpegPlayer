
C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffprobe.exe -i C:/Diana/2022_Diana/CreatingWebsites/ffmpegPlayer/uploads/cat.mp4 -v quiet -print_format json -show_entries stream=width,height -hide_banner > output.txt

C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffmpeg.exe  -i C:/Diana/2022_Diana/CreatingWebsites/media/Bow1.mp4  -c copy .\OutputFiles\Bow1.ts
C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffmpeg.exe  -i C:/Diana/2022_Diana/CreatingWebsites/media/1_DMajorScale_and_BachMusette.mp4  -c copy .\OutputFiles\1_DMajorScale_and_BachMusette.ts
echo file '.\OutputFiles\Bow1.ts' > resultfile.txt
echo file '.\OutputFiles\1_DMajorScale_and_BachMusette.ts'  >> resultfile.txt
C:\Programs\ffmpeg\ffmpeg-2021-04-25-git-d98884be41-full_build\bin\ffmpeg.exe -f concat -safe 0 -i resultfile.txt -c copy .\OutputFiles\output.mp4
