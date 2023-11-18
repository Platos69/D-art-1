import os

def renomear_musicas():
    diretorio = os.getcwd()
    arquivos = os.listdir(diretorio)

    musicas = [arquivo for arquivo in arquivos if arquivo.endswith(('.mp3', '.ogg'))]

    # Encontrar o número inicial
    numeros_utilizados = set()
    for musica in musicas:
        partes = musica.split('.')
        if len(partes) == 2 and partes[0].startswith('musica') and partes[0][6:].isdigit():
            numeros_utilizados.add(int(partes[0][6:]))

    numero_inicial = 1
    while numero_inicial in numeros_utilizados:
        numero_inicial += 1

    for i, musica in enumerate(musicas, start=numero_inicial):
        nome_original = os.path.join(diretorio, musica)
        novo_nome = os.path.join(diretorio, f"musica{i}.mp3")

        # Verificar se o próximo número segue a lógica
        while os.path.exists(novo_nome) or (i - numero_inicial) >= len(musicas):
            i += 1
            novo_nome = os.path.join(diretorio, f"musica{i}.mp3")

        os.rename(nome_original, novo_nome)
        print(f"Renomeando {musica} para {novo_nome}")

renomear_musicas()