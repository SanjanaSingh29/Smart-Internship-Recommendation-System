from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def similarity(student_vector,
               internship_vector):

    score = cosine_similarity(

        np.array(student_vector).reshape(1,-1),

        np.array(internship_vector).reshape(1,-1)

    )

    return float(score[0][0])