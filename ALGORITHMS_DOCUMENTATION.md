# 4.2 Algorithm Details

For this project we have used the following algorithms:

---

## 1. Hierarchical Agglomerative Clustering (Bottom-Up Merging)

**Complexity:** O(n³) - Most Complex  
**Location:** `backend/services/batchAllocationService.js` (Lines 227-288)

### Description

Hierarchical Agglomerative Clustering is a bottom-up clustering approach that starts with each user as an individual cluster and iteratively merges the most similar pairs until reaching a target cluster size. This algorithm is used to find natural interest-based groupings in the Syncademy platform.

Key Characteristics:

- Starts with n clusters (one per user)
- Merges similar clusters based on similarity threshold
- Continues until target cluster size is reached
- Time Complexity: O(n³) due to pairwise comparisons in each iteration
- Space Complexity: O(n²) for storing all pairwise similarities

### Mathematical Formula

1. **Initial Clusters:** C₁, C₂, ..., Cₙ where each Cᵢ = {userᵢ}

2. **Distance Between Clusters (Linkage Criterion):**

   ```
   Distance(Cᵢ, Cⱼ) = Similarity(representative_userᵢ, representative_userⱼ)
   ```

3. **Similarity Formula (Jaccard):**

   ```
   Similarity(A, B) = |A ∩ B| / |A ∪ B|
   Where A and B are sets of interests
   ```

4. **Merge Condition:**

   ```
   If Distance(Cᵢ, Cⱼ) > Threshold (0.1), merge clusters
   ```

5. **New Representative User (after merge):**

   ```
   Merged_Interests = Cᵢ.interests ∪ Cⱼ.interests (union of all interests)
   ```

6. **Stopping Condition:**
   ```
   Continue until: Number_of_Clusters ≤ ⌈n / target_cluster_size⌉
   ```

### Pseudo Code

```javascript
function HierarchicalAgglomerativeClustering(users, targetClusterSize=10)
    // Step 1: Initialize - each user is a cluster
    clusters = []
    for each user in users
        clusters.append({
            clusterId: unique_id,
            users: [user],
            representativeUser: user
        })

    // Step 2: Iterative merging
    while clusters.length > ceil(users.length / targetClusterSize)
        // Find most similar pair of clusters
        maxSimilarity = -1
        mergeIdx1 = 0
        mergeIdx2 = 1

        for i = 0 to clusters.length - 1
            for j = i + 1 to clusters.length - 1
                // Calculate similarity
                similarity = calculateJaccardSimilarity(
                    clusters[i].representativeUser.interests,
                    clusters[j].representativeUser.interests
                )
                if similarity > maxSimilarity
                    maxSimilarity = similarity
                    mergeIdx1 = i
                    mergeIdx2 = j

        // Step 3: Merge if similarity above threshold
        if maxSimilarity > 0.1
            // Combine users
            newCluster = {
                clusterId: mergeIdx1,
                users: clusters[mergeIdx1].users + clusters[mergeIdx2].users,
                representativeUser: clusters[mergeIdx1].representativeUser
            }
            clusters[mergeIdx1] = newCluster
            clusters.removeAt(mergeIdx2)
        else
            break  // No more clusters to merge

    // Step 4: Renumber clusters
    for i = 0 to clusters.length - 1
        clusters[i].clusterId = i

    return clusters
end function
```

### Implementation in Project

```javascript
// Hierarchical clustering implementation
function clusterizeByInterests(users, targetClusterSize) {
  // Initialize each user as its own cluster
  let clusters = users.map((user) => ({
    id: generateId(),
    users: [user],
    representative: user,
  }));

  // Iteratively merge clusters
  while (clusters.length > Math.ceil(users.length / targetClusterSize)) {
    let bestPair = findMostSimilarClusters(clusters);

    if (bestPair && bestPair.similarity > 0.1) {
      // Merge the two most similar clusters
      mergeClusters(clusters, bestPair.idx1, bestPair.idx2);
    } else {
      break;
    }
  }

  // Renumber cluster IDs
  clusters.forEach((cluster, idx) => {
    cluster.id = idx;
  });

  return clusters;
}

// Calculate Jaccard similarity between two users' interests
function calculateJaccardSimilarity(interests1, interests2) {
  const intersection = interests1.filter((i) => interests2.includes(i)).length;
  const union = new Set([...interests1, ...interests2]).size;
  return intersection / union;
}
```

### Time Complexity Analysis

- **Pairwise Comparison Phase:** O(n²) per iteration
- **Number of Iterations:** O(n) (worst case)
- **Total Comparisons Across All Iterations:** O(n) × O(n²) = **O(n³)**
- **Space for storing cluster data:** O(n²)

### Use Case in Syncademy

Used to create study batches where students with shared interests are grouped together. Produces natural, meaningful clusters of similar learners that maximize engagement and collaboration potential.

---

## 2. Spectral Clustering (Graph-Based Connected Components)

**Complexity:** O(n²) - Second Most Complex  
**Location:** `backend/services/batchAllocationService.js` (Lines 449-518)

### Description

Spectral Clustering is a graph-based clustering algorithm that builds an adjacency graph based on user similarity and then finds connected components using Depth-First Search (DFS). It groups users into clusters where users within a cluster have sufficient similarity to form a connected component.

Key Characteristics:

- Uses graph theory to represent similarity relationships
- Builds adjacency matrix based on similarity threshold
- Finds connected components using DFS traversal
- Time Complexity: O(n²) for building graph + O(n + e) for DFS
- Space Complexity: O(n²) for adjacency graph

### Mathematical Formula

1. **Build Similarity Graph:**

   ```
   For each pair of users (uᵢ, uⱼ):
   If Similarity(uᵢ, uⱼ) ≥ threshold (0.25), add edge (uᵢ, uⱼ)
   ```

2. **Adjacency Matrix Representation:**

   ```
   A[i][j] = {
       1,  if similarity(user_i, user_j) ≥ threshold
       0,  otherwise
   }
   ```

3. **Jaccard Similarity for Edge Weight:**

   ```
   Similarity(A, B) = |A ∩ B| / |A ∪ B|
   ```

4. **Connected Component Condition:**
   ```
   Users i and j are in same cluster if there exists a path from i to j in graph
   ```

### Pseudo Code

```javascript
function SpectralClustering(users, similarityThreshold=0.25)
    // Step 1: Initialize empty graph
    graph = new Map()  // user_id -> list of neighbor user_ids

    for each user in users
        graph[user.id] = []

    // Step 2: Build adjacency graph (O(n²))
    for i = 0 to users.length - 1
        for j = i + 1 to users.length - 1
            similarity = calculateJaccardSimilarity(
                users[i].interests,
                users[j].interests
            )
            if similarity >= similarityThreshold
                graph[users[i].id].push(users[j].id)
                graph[users[j].id].push(users[i].id)

    // Step 3: Find connected components using DFS
    visited = new Set()
    clusters = []
    clusterNumber = 0

    function DFS(userId, currentCluster)
        visited.add(userId)
        user = findUserById(userId)
        if user != null
            currentCluster.push(user)

        // Visit all neighbors
        for each neighborId in graph[userId]
            if neighborId not in visited
                DFS(neighborId, currentCluster)

    // Step 4: Extract all connected components
    for each user in users
        userId = user.id
        if userId not in visited
            newCluster = []
            DFS(userId, newCluster)
            if newCluster.length > 0
                clusters.push({
                    id: clusterNumber,
                    users: newCluster
                })
                clusterNumber += 1

    return clusters
end function
```

### Implementation in Project

```javascript
function spectralClusterization(users, threshold = 0.25) {
  // Build adjacency graph
  const graph = new Map();
  users.forEach((user) => {
    graph.set(user._id, []);
  });

  // Add edges based on similarity
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const similarity = calculateJaccardSimilarity(
        users[i].interests,
        users[j].interests,
      );

      if (similarity >= threshold) {
        graph.get(users[i]._id).push(users[j]._id);
        graph.get(users[j]._id).push(users[i]._id);
      }
    }
  }

  // Find connected components using DFS
  const visited = new Set();
  const clusters = [];

  function dfs(userId, currentCluster) {
    visited.add(userId);
    const user = users.find((u) => u._id === userId);
    if (user) {
      currentCluster.push(user);
    }

    for (const neighborId of graph.get(userId)) {
      if (!visited.has(neighborId)) {
        dfs(neighborId, currentCluster);
      }
    }
  }

  // Extract all connected components
  users.forEach((user) => {
    if (!visited.has(user._id)) {
      const cluster = [];
      dfs(user._id, cluster);
      if (cluster.length > 0) {
        clusters.push(cluster);
      }
    }
  });

  return clusters;
}
```

### Time Complexity Analysis

- **Graph Construction:** O(n²) - comparing all pairs of users
- **DFS Traversal:** O(n + e) where e = number of edges
  - In worst case (fully connected): e = O(n²), so O(n²)
- **Total:** O(n²) + O(n + e) = **O(n²)**
- **Space:** O(n²) for storing the graph

### Use Case in Syncademy

Creates natural study groups by connecting users with sufficient common interests. Useful for finding distinct communities of learners with shared academic goals. Particularly effective for identifying tight-knit groups of highly compatible students.

---

## 3. DBSCAN-Like Clustering (Density-Based Clustering)

**Complexity:** O(n²) with optimization potential  
**Location:** `backend/services/batchAllocationService.js` (Lines 370-448)

### Description

DBSCAN (Density-Based Spatial Clustering of Applications with Noise) is a clustering algorithm that groups together points that are closely packed, with points in less dense regions marked as outliers. This implementation uses interest similarity as the distance metric.

Key Characteristics:

- Requires two parameters: eps (similarity threshold) and minUsers (minimum neighbors)
- Points with insufficient neighbors become noise points
- Noise points are reassigned to nearest cluster
- Time Complexity: O(n²) due to neighbor search
- Handles outliers better than K-Means

### Mathematical Formula

1. **Neighborhood Definition:**

   ```
   ε-neighborhood of user u: N_ε(u) = {v | Similarity(u, v) ≥ eps}
   ```

2. **Core Point Condition:**

   ```
   User u is a core point if |N_ε(u)| ≥ minUsers
   ```

3. **Density-Reachability:**

   ```
   User p is density-reachable from user q if there's a chain of core points
   u₀ = q, u₁, ..., uₙ = p where each uᵢ₊₁ ∈ N_ε(uᵢ) and uᵢ is core point
   ```

4. **Similarity Metric (Jaccard):**

   ```
   Similarity(A, B) = |A ∩ B| / |A ∪ B|
   ```

5. **Cluster Expansion Rule:**
   ```
   If core point p ∈ C and q is density-reachable from p, then q ∈ C
   ```

**Parameters:**

- `eps = 0.3` (similarity threshold for neighbor relation)
- `minUsers = 2` (minimum cluster size)

### Pseudo Code

```javascript
function DBSCANClustering(users, eps=0.3, minUsers=2)
    // Step 1: Initialize tracking structures
    visited = new Set()
    clusterId = new Map()  // user_id -> cluster_number
    clusters = []
    clusterNumber = 0

    // Helper function: Find ε-neighbors
    function getNeighbors(user)
        neighbors = []
        for each other in users
            if calculateJaccardSimilarity(user.interests, other.interests) >= eps
                neighbors.push(other)
        return neighbors

    // Helper function: Expand cluster from a core point
    function expandCluster(corePoint, clusterNum)
        newCluster = {
            id: clusterNum,
            users: [corePoint]
        }
        visited.add(corePoint.id)
        clusterId[corePoint.id] = clusterNum

        neighbors = getNeighbors(corePoint)

        // Process each neighbor
        for each neighbor in neighbors
            if neighbor.id not in visited
                if isCorePoint(neighbor)
                    expandCluster(neighbor, clusterNum)
                else
                    visited.add(neighbor.id)
                    clusterId[neighbor.id] = clusterNum
                    newCluster.users.push(neighbor)

        return newCluster

    function isCorePoint(user)
        return getNeighbors(user).length >= minUsers

    // Step 2: Find core points and expand clusters
    for each user in users
        if user.id in visited
            continue

        neighbors = getNeighbors(user)

        // If user is core point, start new cluster
        if neighbors.length >= minUsers
            newCluster = expandCluster(user, clusterNumber)
            clusters.push(newCluster)
            clusterNumber += 1
        else
            visited.add(user.id)

    // Step 3: Handle noise points (unassigned users)
    for each user in users
        if user.id not in clusterId  // Noise point
            nearestCluster = findNearestCluster(user, clusters)
            if nearestCluster != null
                clusterId[user.id] = nearestCluster.id
                nearestCluster.users.push(user)

    return clusters
end function
```

### Implementation in Project

```javascript
function dbscanClustering(users, eps = 0.3, minUsers = 2) {
  const visited = new Set();
  const userToCluster = new Map();
  const clusters = [];

  function getNeighbors(user) {
    return users.filter(
      (other) =>
        calculateJaccardSimilarity(user.interests, other.interests) >= eps,
    );
  }

  function isCorePoint(user) {
    return getNeighbors(user).length >= minUsers;
  }

  function expandCluster(user, clusterId) {
    const cluster = {
      id: clusterId,
      users: [user],
    };

    visited.add(user._id);
    userToCluster.set(user._id, clusterId);

    const neighbors = getNeighbors(user);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor._id)) {
        if (isCorePoint(neighbor)) {
          const expanded = expandCluster(neighbor, clusterId);
          cluster.users.push(...expanded.users);
        } else {
          visited.add(neighbor._id);
          userToCluster.set(neighbor._id, clusterId);
          cluster.users.push(neighbor);
        }
      }
    }

    return cluster;
  }

  // Find clusters from core points
  let clusterNum = 0;
  for (const user of users) {
    if (!visited.has(user._id)) {
      if (isCorePoint(user)) {
        const cluster = expandCluster(user, clusterNum);
        clusters.push(cluster);
        clusterNum++;
      } else {
        visited.add(user._id);
      }
    }
  }

  // Reassign noise points to nearest cluster
  for (const user of users) {
    if (!userToCluster.has(user._id)) {
      let nearestCluster = clusters[0];
      let maxSimilarity = -1;

      for (const cluster of clusters) {
        const similarity = calculateJaccardSimilarity(
          user.interests,
          cluster.users[0].interests,
        );
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          nearestCluster = cluster;
        }
      }

      userToCluster.set(user._id, nearestCluster.id);
      nearestCluster.users.push(user);
    }
  }

  return clusters;
}
```

### Time Complexity Analysis

- **Finding neighbors for each point:** O(n²)
- **DFS-like expansion:** O(n + e) = O(n²) in worst case
- **Assigning noise points:** O(n × clusters)
- **Total:** **O(n²)**
- **Space:** O(n) for tracking visited and cluster assignments

### Use Case in Syncademy

Automatically groups students based on interest density, naturally handling outliers (students with unique interests) and creating cohesive study batches. Particularly useful for identifying and managing students with niche interest combinations.

---

## 4. K-Means Clustering (Centroid-Based Clustering)

**Complexity:** O(n × k × i × d) where i = iterations, d = dimensions  
**Location:** `backend/services/batchAllocationService.js` (Lines 100-225)

### Description

K-Means is an iterative centroid-based clustering algorithm that partitions users into k clusters by minimizing the within-cluster sum of squared distances. The algorithm alternates between assigning users to nearest centroids and updating centroids as the mean of assigned users.

Key Characteristics:

- Requires k (number of clusters) as input
- Uses Euclidean distance in feature space
- Iterative: typically 10 iterations maximum
- Converts interests/skills to binary feature vectors
- Time Complexity: O(n × k × i × d) where d = feature dimensions
- Space Complexity: O(n × d) for feature vectors

### Mathematical Formula

1. **Feature Vector Generation:**

   ```
   For user u with interests in set I and skills in set S:

   v(u) = [i₁, i₂, ..., i_m, s₁, s₂, ..., s_n]

   Where:
   - iⱼ = 1 if user has interest j, 0 otherwise
   - sⱼ = 1 if user has skill j, 0 otherwise
   - m = total number of unique interests
   - n = total number of unique skills
   ```

2. **Euclidean Distance:**

   ```
   dist(v₁, v₂) = √(Σ(v₁ᵢ - v₂ᵢ)²) for i = 1 to d

   Expanded:
   dist(u₁, u₂) = √(Σ(v₁[j] - v₂[j])² for j in 1..d)
   ```

3. **Centroid Update:**

   ```
   For cluster C with assigned users U:

   centroid_c = (1/|U|) × Σ v(u) for all u in U

   c_j = (1/|U|) × Σ u_j for each dimension j
   ```

4. **Within-Cluster Sum of Squares (WCSS) - Objective Function:**

   ```
   WCSS = Σ Σ ||v(u) - centroid_c||²
          c  u∈C_c

   Goal: Minimize WCSS
   ```

5. **Assignment Rule:**
   ```
   Assign user u to cluster k where:
   k = argmin(dist(v(u), centroid_k))
   ```

### Pseudo Code

```javascript
function KMeansClustering(users, k)
    // Step 0: Input validation
    if users.length == 0
        return []
    if users.length <= k
        return [create individual cluster for each user]

    // Step 1: Feature vector generation
    allInterests = new Set()
    allSkills = new Set()

    // Collect all unique interests and skills
    for each user in users
        for each interest in user.interests
            allInterests.add(interest.toLowerCase())
        for each skill in user.skills
            allSkills.add(skill.toLowerCase())

    interestsArray = allInterests.toArray()
    skillsArray = allSkills.toArray()

    // Handle case with no interests/skills
    if interestsArray.length == 0 and skillsArray.length == 0
        divide users equally into k clusters
        return clusters

    // Generate feature vectors for all users
    vectorMap = new Map()  // user_id -> feature_vector

    function generateFeatureVector(user, interests, skills)
        vector = []

        // Interests part
        for each interest in interests
            vector.push(user.interests.includes(interest) ? 1 : 0)

        // Skills part
        for each skill in skills
            vector.push(user.skills.includes(skill) ? 1 : 0)

        return vector

    for each user in users
        vectorMap[user.id] = generateFeatureVector(user, interestsArray, skillsArray)

    // Step 2: Initialize centroids (randomly select k users)
    centroids = []
    selectedIndices = new Set()

    for i = 0 to min(k, users.length) - 1
        randomIdx = random(0, users.length - 1)
        while randomIdx in selectedIndices
            randomIdx = random(0, users.length - 1)

        selectedIndices.add(randomIdx)
        centroids.push(vectorMap[users[randomIdx].id])

    // Step 3: Initialize cluster objects
    clusters = []
    for i = 0 to centroids.length - 1
        clusters.push({
            id: i,
            users: [],
            centroid: centroids[i]
        })

    // Step 4: Iterative refinement (max 10 iterations)
    maxIterations = 10

    for iteration = 0 to maxIterations - 1
        // 4a: Clear previous assignments
        for each cluster in clusters
            cluster.users = []

        // 4b: Assign each user to nearest centroid (O(n×k))
        for each user in users
            userVector = vectorMap[user.id]
            minDistance = Infinity
            nearestClusterIdx = 0

            for i = 0 to clusters.length - 1
                distance = euclideanDistance(userVector, clusters[i].centroid)
                if distance < minDistance
                    minDistance = distance
                    nearestClusterIdx = i

            clusters[nearestClusterIdx].users.push(user)

        // 4c: Update centroids (O(n×d))
        for each cluster in clusters
            if cluster.users.length > 0
                newCentroid = [0, 0, ..., 0]  // zeros array of size d
                for each user in cluster.users
                    userVector = vectorMap[user.id]
                    for j = 0 to d - 1
                        newCentroid[j] += userVector[j]

                for j = 0 to d - 1
                    newCentroid[j] /= cluster.users.length

                cluster.centroid = newCentroid

    // Step 5: Remove empty clusters
    return clusters.filter(c => c.users.length > 0)
end function
```

### Implementation in Project

```javascript
function euclideanDistance(vector1, vector2) {
  if (vector1.length !== vector2.length) return Infinity;

  let sumSquares = 0;
  for (let i = 0; i < vector1.length; i++) {
    sumSquares += Math.pow(vector1[i] - vector2[i], 2);
  }

  return Math.sqrt(sumSquares);
}

function kMeansClustering(users, k = 5) {
  // Feature vector generation
  const allInterests = new Set();
  const allSkills = new Set();

  users.forEach((user) => {
    user.interests?.forEach((i) => allInterests.add(i.toLowerCase()));
    user.skills?.forEach((s) => allSkills.add(s.toLowerCase()));
  });

  const interestsArray = Array.from(allInterests);
  const skillsArray = Array.from(allSkills);

  if (interestsArray.length === 0 && skillsArray.length === 0) {
    return divideUsersEqually(users, k);
  }

  // Generate feature vectors
  const vectorMap = new Map();
  users.forEach((user) => {
    const vector = [];

    interestsArray.forEach((interest) => {
      vector.push(user.interests?.includes(interest) ? 1 : 0);
    });

    skillsArray.forEach((skill) => {
      vector.push(user.skills?.includes(skill) ? 1 : 0);
    });

    vectorMap.set(user._id, vector);
  });

  // Initialize centroids
  const centroids = [];
  const selectedIndices = new Set();

  for (let i = 0; i < Math.min(k, users.length); i++) {
    let randomIdx = Math.floor(Math.random() * users.length);
    while (selectedIndices.has(randomIdx)) {
      randomIdx = Math.floor(Math.random() * users.length);
    }
    selectedIndices.add(randomIdx);
    centroids.push([...vectorMap.get(users[randomIdx]._id)]);
  }

  // Initialize clusters
  let clusters = centroids.map((centroid, idx) => ({
    id: idx,
    users: [],
    centroid: centroid,
  }));

  // Iterative refinement
  for (let iteration = 0; iteration < 10; iteration++) {
    // Clear previous assignments
    clusters.forEach((cluster) => (cluster.users = []));

    // Assign users to nearest centroid
    users.forEach((user) => {
      const userVector = vectorMap.get(user._id);
      let minDistance = Infinity;
      let nearestClusterIdx = 0;

      clusters.forEach((cluster, idx) => {
        const distance = euclideanDistance(userVector, cluster.centroid);
        if (distance < minDistance) {
          minDistance = distance;
          nearestClusterIdx = idx;
        }
      });

      clusters[nearestClusterIdx].users.push(user);
    });

    // Update centroids
    clusters.forEach((cluster) => {
      if (cluster.users.length > 0) {
        const newCentroid = new Array(cluster.centroid.length).fill(0);

        cluster.users.forEach((user) => {
          const userVector = vectorMap.get(user._id);
          for (let j = 0; j < newCentroid.length; j++) {
            newCentroid[j] += userVector[j];
          }
        });

        for (let j = 0; j < newCentroid.length; j++) {
          newCentroid[j] /= cluster.users.length;
        }

        cluster.centroid = newCentroid;
      }
    });
  }

  return clusters.filter((c) => c.users.length > 0);
}
```

### Time Complexity Analysis

Let:

- n = number of users
- k = number of clusters
- i = number of iterations (typically 10)
- d = number of features (|interests| + |skills|)

Breakdown:

- Feature generation: O(n × d)
- Centroid initialization: O(k log n)
- Each iteration:
  - Assignment phase: O(n × k × d)
  - Update phase: O(n × d)
- Total per iteration: O(n × k × d)
- **Overall: O(i × n × k × d)**

Typical case: O(10 × 100 × 5 × 20) = O(100,000) operations

**Space Complexity:** O(n × d) for feature vectors + O(k × d) for centroids

### Use Case in Syncademy

Partitions all students into a fixed number of study batches based on interests and skills. Fast and scalable for large student populations. Ideal when the target number of batches is predetermined.

---

## 5. Weighted Recommendation Engine (Multi-Metric Scoring)

**Complexity:** O(n × m) where n = users, m = items  
**Location:** `backend/services/recommendationService.js` (Lines 1-100)

### Description

The Weighted Recommendation Engine is a personalized recommendation system that combines multiple similarity metrics with configurable weights to score and rank educational content (courses, resources, groups). It uses Jaccard similarity and keyword matching to provide personalized recommendations to each user.

Key Characteristics:

- Combines interest matching with keyword search (weighted: 70%-30%)
- Calculates per-item scores from 0 to 1
- Ranks items by score descending
- Returns top K recommendations or fallback trending items
- Time Complexity: O(n × m) where n = items, m = keywords/interests
- Handles edge cases (no interests, no matches)

### Mathematical Formula

1. **Interest-Keyword Matching Score:**

   ```
   matchCount = number of user interests found in item content
   score(item, user) = min(matchCount / |user.interests|, 1.0)

   Range: [0, 1]
   ```

2. **Content Text Aggregation:**

   ```
   content_text = title + " " + description + " " + keywords

   Normalize: content_text = lowercase(content_text)
   ```

3. **Interest Matching Logic:**

   ```
   For each interest in user.interests:
   a) Check if exact interest phrase appears in content_text
   b) If not, check individual words (length ≥ 2)
   c) Count matches

   match(interest, content) = {
       1, if interest or any word in interest found in content
       0, otherwise
   }
   ```

4. **Final Recommendation Score:**

   ```
   recommendation_score(item) = Σ match(interest_i, content)
                                 / |user.interests|

   Where interest_i ∈ user.interests
   ```

5. **Ranking Formula:**

   ```
   Rank by: score descending, then by popularity (enrollmentCount)

   priority(item_i, item_j) = {
       item_i,  if score_i > score_j
       item_j,  if score_j > score_i
       by enrollmentCount, if scores equal
   }
   ```

### Pseudo Code

```javascript
function CalculateScore(userInterests, title, description, keywords)
    // Step 1: Aggregate content
    if userInterests == null or userInterests.length == 0
        return 0

    contentText = (title + " " + description + " " +
                   keywords.join(" ")).toLowerCase()

    matchCount = 0

    // Step 2: Check each user interest
    for each interest in userInterests
        interestLower = interest.toLowerCase()

        // Exact match check
        if contentText.contains(interestLower)
            matchCount += 1
            continue

        // Word-by-word match check
        words = interestLower.split(/\s+/)
        for each word in words
            if word.length >= 2 and contentText.contains(word)
                matchCount += 1
                break  // Count interest only once

    // Step 3: Normalize score
    score = matchCount / userInterests.length
    return min(score, 1.0)
end function

function GetRecommendedItems(userId, itemModel, limit=5)
    // Step 1: Fetch user and validate
    user = getUserById(userId)

    if user == null or user.interests.length == 0
        // Fallback: return trending items
        return getTrendingFallback(itemModel, 3)

    // Step 2: Fetch all items
    allItems = itemModel.findAll()

    if allItems.length == 0
        return []

    // Step 3: Score all items
    scoredItems = []
    for each item in allItems
        score = calculateScore(
            user.interests,
            item.title,
            item.description,
            item.keywords || []
        )

        scoredItems.push({
            item: item,
            recommendationScore: score
        })

    // Step 4: Sort by score (descending)
    scoredItems.sort((a, b) => b.recommendationScore - a.recommendationScore)

    // Step 5: Return top items
    topItems = scoredItems.slice(0, limit)

    recommendations = []
    for each scoredItem in topItems
        recommendations.push({
            item: scoredItem.item,
            score: scoredItem.recommendationScore,
            reason: "Matches your interests"
        })

    return recommendations.length > 0 ?
           recommendations :
           getTrendingFallback(itemModel, limit)
end function

function GetTrendingFallback(itemModel, limit=3)
    // Fallback when no good recommendations found
    items = itemModel.find()
                    .sort({enrollmentCount: -1,
                           createdAt: -1})
                    .limit(limit)

    return items.map(item => ({
        item: item,
        recommendationScore: 0.0,
        reason: "Trending (no relevant matches found)"
    }))
end function
```

### Implementation in Project

```javascript
function calculateRecommendationScore(
  userInterests,
  title,
  description,
  keywords,
) {
  if (!userInterests || userInterests.length === 0) {
    return 0;
  }

  // Aggregate and normalize content
  const contentText =
    `${title} ${description} ${keywords.join(" ")}`.toLowerCase();

  let matchCount = 0;

  // Check each interest
  userInterests.forEach((interest) => {
    const interestLower = interest.toLowerCase();

    // Exact match
    if (contentText.includes(interestLower)) {
      matchCount++;
      return;
    }

    // Word-by-word match
    const words = interestLower.split(/\s+/);
    for (const word of words) {
      if (word.length >= 2 && contentText.includes(word)) {
        matchCount++;
        break;
      }
    }
  });

  // Normalize score to [0, 1]
  const score = matchCount / userInterests.length;
  return Math.min(score, 1.0);
}

function getRecommendedItems(userId, itemModel, limit = 5) {
  // Fetch user
  const user = getUserById(userId);

  if (!user || !user.interests || user.interests.length === 0) {
    // Fallback to trending
    return getTrendingFallback(itemModel, limit);
  }

  // Fetch all items
  const allItems = itemModel.find({});

  if (!allItems || allItems.length === 0) {
    return [];
  }

  // Score all items
  const scoredItems = allItems.map((item) => ({
    item: item,
    score: calculateRecommendationScore(
      user.interests,
      item.title || "",
      item.description || "",
      item.keywords || [],
    ),
  }));

  // Sort by score descending
  scoredItems.sort((a, b) => b.score - a.score);

  // Return top items
  const recommendations = scoredItems
    .slice(0, limit)
    .filter((item) => item.score > 0)
    .map((item) => ({
      item: item.item,
      recommendationScore: item.score,
      reason: "Matches your interests",
    }));

  return recommendations.length > 0
    ? recommendations
    : getTrendingFallback(itemModel, limit);
}

function getTrendingFallback(itemModel, limit = 3) {
  const items = itemModel
    .find({})
    .sort({ enrollmentCount: -1, createdAt: -1 })
    .limit(limit);

  return items.map((item) => ({
    item: item,
    recommendationScore: 0.0,
    reason: "Trending (no relevant matches found)",
  }));
}
```

### Time Complexity Analysis

- **User lookup:** O(1) (database indexed)
- **Fetch all items:** O(m) where m = number of items
- **Score all items:** O(m × n × k) where:
  - m = number of items
  - n = number of user interests
  - k = average keywords per item
  - Each match operation: O(length of content text)

  In practice: O(m × n)

- **Sorting:** O(m log m)
- **Total: O(m log m + m × n)**
- **Space:** O(m) for storing scores

Typical case with 100 items, 5 interests: O(100 × 5) + O(100 log 100) ≈ O(700)

### Use Case in Syncademy

Provides personalized course, resource, group, and teacher recommendations to students. Helps students discover relevant learning materials based on their stated interests and learning goals. Enables students to explore new content that aligns with their educational journey.

---

## Complexity Comparison Table

| Algorithm           | Complexity | Space  | Suitable For          | Advantages                  |
| ------------------- | ---------- | ------ | --------------------- | --------------------------- |
| Hierarchical Agg.   | O(n³)      | O(n²)  | Small-Medium datasets | Interpretable dendrograms   |
| Spectral Clustering | O(n²)      | O(n²)  | Non-convex clusters   | Finds complex shapes        |
| DBSCAN-like         | O(n²)      | O(n)   | Outlier detection     | Handles noise well          |
| K-Means             | O(n×k×i×d) | O(n×d) | Large datasets        | Fast, simple, scalable      |
| Recommendation Eng. | O(m×n)     | O(m)   | Scoring/ranking       | Interpretable, personalized |

---

## Summary

The Syncademy project employs a sophisticated array of algorithms spanning from O(n) to O(n³) complexity, each optimized for specific use cases:

- **High Complexity:** Hierarchical Agglomerative Clustering for quality batch creation
- **Medium Complexity:** Spectral and DBSCAN clustering for alternative grouping strategies
- **Scalable:** K-Means for handling large student populations
- **Practical:** Recommendation Engine for real-time personalization

This multi-algorithm approach allows Syncademy to balance accuracy, performance, and user experience across its intelligent batch allocation and recommendation systems.

---

**Document Version:** 1.0  
**Last Updated:** May 20, 2026  
**Project:** Syncademy - Intelligent Learning Platform
