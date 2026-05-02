from pydub import AudioSegment
import os


def merge_audio(audio_files):

    final_audio = AudioSegment.empty()

    for file in audio_files:

        segment = AudioSegment.from_mp3(file)

        final_audio += segment

    output_path = "final_podcast.mp3"

    final_audio.export(output_path, format="mp3")

    return output_path