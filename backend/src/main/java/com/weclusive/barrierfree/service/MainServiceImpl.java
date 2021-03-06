package com.weclusive.barrierfree.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.weclusive.barrierfree.entity.Post;
import com.weclusive.barrierfree.entity.Tourapi;
import com.weclusive.barrierfree.repository.PostImpairmentRepository;
import com.weclusive.barrierfree.repository.PostRepository;
import com.weclusive.barrierfree.repository.ScrapRepository;
import com.weclusive.barrierfree.repository.UserRepository;
import com.weclusive.barrierfree.util.TimeUtils;

@Service
public class MainServiceImpl implements MainService {

	@Autowired
	PostRepository postRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PostImpairmentRepository postImpairmentRepository;

	@Autowired
	ScrapRepository scrapRepository;

	@Override
	public List<Map<String, Object>> readAllPost(int userSeq) {
		List<Map<String, Object>> result = new LinkedList<>();
		postRepository.findAll().forEach(post -> {
			Map<String, Object> obj = new HashMap<>();
			obj.put("postSeq", post.getPostSeq());
			obj.put("UserSeq", post.getUserSeq());
			obj.put("postTitle", post.getPostTitle());
			obj.put("postContent", post.getPostContent());
			obj.put("postScrap", post.getPostScrap());
			obj.put("postPhoto", post.getPostPhoto());
			obj.put("postAlt", post.getPostAlt());
			obj.put("postLocation", post.getPostLocation());
			obj.put("postAddress", post.getPostAddress());
			obj.put("postLat", post.getPostLat());
			obj.put("postLng", post.getPostLng());
			obj.put("postPoint", post.getPostPoint());
			obj.put("contentId", post.getContentId());
			obj.put("delYn", post.getDelYn());
			obj.put("regDt", post.getRegDt());
			obj.put("regId", post.getRegId());
			obj.put("modDt", post.getModDt());
			obj.put("modId", post.getModId());
//			List<PostImpairment> list = postImpairmentRepository.findByPostSeq(post.getpostSeq());
			List<String> list = postImpairmentRepository.findImpairment(post.getPostSeq());
			obj.put("impairment", list);

			char scrapYn = 'n';
			// ?????? ???????????? seq??? ???????????? api ??????
			if (scrapRepository.countByDelYnAndScrapTypeAndUserSeqAndScrapData('n', '0', userSeq,
					post.getPostSeq()) > 0)
				scrapYn = 'y';
			obj.put("scrapYn", scrapYn);
			result.add(obj);
		});
		return result;
	}

	@Override
	public List<Map<String, Object>> readPostlatest(int userSeq, int page, int size) {
		List<Map<String, Object>> result = new LinkedList<>();
		PageRequest pageRequest = PageRequest.of(page-1, size);
		Page<Post> pagePosts = null;
		pagePosts = postRepository.findByDelYnOrderByRegDtDesc('n', pageRequest);
		pagePosts.forEach(post -> {
			Map<String, Object> obj = new HashMap<>();
			obj.put("postSeq", post.getPostSeq());
			obj.put("UserSeq", post.getUserSeq());
			obj.put("postTitle", post.getPostTitle());
			obj.put("postContent", post.getPostContent());
			obj.put("postScrap", post.getPostScrap());
			obj.put("postPhoto", post.getPostPhoto());
			obj.put("postAlt", post.getPostAlt());
			obj.put("postLocation", post.getPostLocation());
			List<String> list = postImpairmentRepository.findImpairment(post.getPostSeq());
			obj.put("impairment", list);
			obj.put("totalElements", postRepository.countByDelYn('n'));
			char scrapYn = 'n';
			// ?????? ???????????? seq??? ???????????? api ??????
			if (scrapRepository.countByDelYnAndScrapTypeAndUserSeqAndScrapData('n', '0', userSeq,
					post.getPostSeq()) > 0)
				scrapYn = 'y';

			obj.put("scrapYn", scrapYn);
			result.add(obj);
		});
		return result;
	}

	// ????????? ?????? ???
	@Override
	public List<Map<String, Object>> readPostScrap(int userSeq, int page, int size) {
		List<Map<String, Object>> result = new LinkedList<>();
		PageRequest pageRequest = PageRequest.of(page-1, size);
		Page<Post> pagePosts = null;
		pagePosts = postRepository.findByDelYnOrderByPostScrapDescPostSeqAsc('n',pageRequest);
		pagePosts.forEach(post -> {
			Map<String, Object> obj = new HashMap<>();
			obj.put("postSeq", post.getPostSeq());
			obj.put("UserSeq", post.getUserSeq());
			obj.put("postTitle", post.getPostTitle());
			obj.put("postContent", post.getPostContent());
			obj.put("postScrap", post.getPostScrap());
			obj.put("postPhoto", post.getPostPhoto());
			obj.put("postAlt", post.getPostAlt());
			obj.put("postLocation", post.getPostLocation());
			List<String> list = postImpairmentRepository.findImpairment(post.getPostSeq());
			obj.put("impairment", list);
			obj.put("totalElements", postRepository.countByDelYn('n'));
			char scrapYn = 'n';
			// ?????? ???????????? seq??? ???????????? api ??????
			if (scrapRepository.countByDelYnAndScrapTypeAndUserSeqAndScrapData('n', '0', userSeq,
					post.getPostSeq()) > 0)
				scrapYn = 'y';

			obj.put("scrapYn", scrapYn);
			result.add(obj);
		});
		return result;
	}

	// ????????? ????????? ???
	@Override
	public List<Map<String, Object>> readPostWeek(int userSeq, int page, int size) {
		List<Map<String, Object>> result = new LinkedList<>();
		String startTime = LocalDateTime.now().minusDays(7).toString().replace("T", " ").substring(0, 19);
		String endTime = TimeUtils.curTime();
		PageRequest pageRequest = PageRequest.of(page-1, size);
		Page<Post> pagePosts = postRepository.findByDelYnAndRegDtBetweenOrderByPostScrapDescPostSeqAsc('n', startTime, endTime, pageRequest);
		pagePosts.forEach(post -> {
			Map<String, Object> obj = new HashMap<>();
			obj.put("postSeq", post.getPostSeq());
			obj.put("UserSeq", post.getUserSeq());
			obj.put("postTitle", post.getPostTitle());
			obj.put("postContent", post.getPostContent());
			obj.put("postScrap", post.getPostScrap());
			obj.put("postPhoto", post.getPostPhoto());
			obj.put("postAlt", post.getPostAlt());
			obj.put("postLocation", post.getPostLocation());
			List<String> list = postImpairmentRepository.findImpairment(post.getPostSeq());
			obj.put("impairment", list);
			obj.put("totalElements", postRepository.countByDelYnAndRegDtBetweenOrderByPostScrapDesc('n',startTime, endTime));
			char scrapYn = 'n';
			// ?????? ???????????? seq??? ???????????? api ??????
			if (scrapRepository.countByDelYnAndScrapTypeAndUserSeqAndScrapData('n', '0', userSeq,
					post.getPostSeq()) > 0)
				scrapYn = 'y';

			obj.put("scrapYn", scrapYn);
			result.add(obj);
		});
		return result;
	}

	// ????????? ?????????
	@Override
	public List<Map<String, Object>> readPostFollowing(int userSeq, int page, int size) {
		List<Map<String, Object>> result = new LinkedList<>();
		PageRequest pageRequest = PageRequest.of(page-1, size);
		Page<Post> pagePosts = postRepository.findFollowPost(userSeq, pageRequest);
		pagePosts.forEach(post -> {
			Map<String, Object> obj = new HashMap<>();
			obj.put("postSeq", post.getPostSeq());
			obj.put("UserSeq", post.getUserSeq());
			obj.put("postTitle", post.getPostTitle());
			obj.put("postContent", post.getPostContent());
			obj.put("postScrap", post.getPostScrap());
			obj.put("postPhoto", post.getPostPhoto());
			obj.put("postAlt", post.getPostAlt());
			obj.put("postLocation", post.getPostLocation());
			List<String> list = postImpairmentRepository.findImpairment(post.getPostSeq());
			obj.put("impairment", list);
			obj.put("totalElements", postRepository.countFollowPost(userSeq));
			char scrapYn = 'n';
			// ?????? ???????????? seq??? ???????????? api ??????
			if (scrapRepository.countByDelYnAndScrapTypeAndUserSeqAndScrapData('n', '0', userSeq,
					post.getPostSeq()) > 0)
				scrapYn = 'y';

			obj.put("scrapYn", scrapYn);
			result.add(obj);
		});
		return result;
	}

}
